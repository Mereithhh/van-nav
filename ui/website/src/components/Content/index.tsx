import "./index.scss";
import CardV2 from "../CardV2";
import SearchBar from "../SearchBar";
import { Loading } from "../Loading";
import { Helmet } from "react-helmet";
import { useCallback, useEffect, useState } from "react";
import FetchList from "../../utils/api";
import TagSelector from "../TagSelector";
import { useDebounce } from "../../utils/tools";

const Content = (props: any) => {
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [currTag, setCurrTag] = useState("全部工具");
  const [searchString, setSearchString] = useState("");
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const r = await FetchList();
      setData(r);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }, [setData, setLoading]);
  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSetCurrTag = (tag: string) => {
    setCurrTag(tag);
    window.localStorage.setItem("tag", tag);
  };

  const handleSetSearch = useDebounce((val: string) => {
    if (val !== "" && val) {
      setCurrTag("全部工具");
    } else {
      const tagInLocalStorage = window.localStorage.getItem("tag");
      if (tagInLocalStorage && tagInLocalStorage !== "") {
        setCurrTag(tagInLocalStorage);
      }
    }
    setSearchString(val);
  }, 500);

  const renderCardsV2 = useCallback(() => {
    if (data.tools) {
      return data.tools
        .filter((item: any) => {
          if (currTag === "全部工具") {
            return true;
          }
          return item.catelog === currTag;
        })
        .filter((item: any) => {
          if (searchString === "") {
            return true;
          }
          return (item.name as string)
            .toLowerCase()
            .includes(searchString.toLowerCase());
        })
        .map((item) => {
          return (
            <CardV2
              title={item.name}
              url={item.url}
              des={item.desc}
              logo={item.logo}
              key={item.id}
              catelog={item.catelog}
            />
          );
        });
    }
    return null;
  }, [data, currTag, searchString]);

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <link
          rel="icon"
          href={
            data?.setting?.favicon ?? "https://pic.mereith.com/img/male.svg"
          }
        />
        <title>{data?.setting?.title ?? "Mereith's Nav Site"}</title>
      </Helmet>
      <div className="topbar">
        <div className="content">
          <SearchBar setSearchText={handleSetSearch} />
          <TagSelector
            tags={data?.catelogs ?? ["全部工具"]}
            currTag={currTag}
            onTagChange={handleSetCurrTag}
          />
        </div>
      </div>
      <div className="content-wraper">
        <div className="content cards">
          {loading ? <Loading></Loading> : renderCardsV2()}
        </div>
      </div>
    </>
  );
};

export default Content;
