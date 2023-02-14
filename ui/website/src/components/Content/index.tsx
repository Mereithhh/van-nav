import "./index.css";
import CardV2 from "../CardV2";
import SearchBar from "../SearchBar";
import { Loading } from "../Loading";
import { Helmet } from "react-helmet";
import { useCallback, useEffect, useMemo, useState } from "react";
import FetchList from "../../utils/api";
import TagSelector from "../TagSelector";
import { useDebounce } from "../../utils/tools";
import pinyin from "pinyin-match";

const mutiSearch = (s, t) => {
  const source = (s as string).toLowerCase();
  const target = t.toLowerCase();
  const rawInclude = source.includes(target);
  const pinYinInlcude = Boolean(pinyin.match(source, target));
  return rawInclude || pinYinInlcude;
};

const Content = (props: any) => {
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [currTag, setCurrTag] = useState("全部工具");
  const [searchString, setSearchString] = useState("");
  const [val, setVal] = useState("");
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const r = await FetchList();
      setData(r);
      const tagInLocalStorage = window.localStorage.getItem("tag");
      if (tagInLocalStorage && tagInLocalStorage !== "") {
        if (r?.catelogs && r?.catelogs.includes(tagInLocalStorage)) {
          setCurrTag(tagInLocalStorage);
        }
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }, [setData, setLoading, setCurrTag]);
  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSetCurrTag = (tag: string) => {
    setCurrTag(tag);
    // 管理后台不记录了
    if (tag !== "管理后台") {
      window.localStorage.setItem("tag", tag);
    }
    resetSearch(true);
  };

  const resetSearch = (notSetTag?: boolean) => {
    setVal("");
    setSearchString("");
    const tagInLocalStorage = window.localStorage.getItem("tag");
    if (!notSetTag &&tagInLocalStorage && tagInLocalStorage !== "" && tagInLocalStorage !== "管理后台") {
      setCurrTag(tagInLocalStorage);
    }
  };

  const handleSetSearch = useDebounce((val: string) => {
    if (val !== "" && val) {
      setCurrTag("全部工具");
      setSearchString(val);
    } else {
      resetSearch();
    }
  }, 500);

  const filteredData = useMemo(() => {
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
          return (
            mutiSearch(item.name, searchString) ||
            mutiSearch(item.desc, searchString) || 
            mutiSearch(item.url, searchString)
          );
        });
    } else {
      return [];
    }
  }, [data, currTag, searchString]);

  const renderCardsV2 = useCallback(() => {
    return filteredData.map((item) => {
      return (
        <CardV2
          title={item.name}
          url={item.url}
          des={item.desc}
          logo={item.logo}
          key={item.id}
          catelog={item.catelog}
          onClick={() => {
            resetSearch();
          }}
        />
      );
    });
  }, [filteredData]);

  const onKeyEnter = (ev) => {
    const searchEl: any = document.getElementById("search-bar");
    const cards = data?.tools?.filter((item: any) => {
      if (searchEl?.value === "") {
        return true;
      }
      return (
        mutiSearch(item.name, searchEl?.value) ||
        mutiSearch(item.desc, searchEl?.value) || 
        mutiSearch(item.url,  searchEl?.value)
      );
    });
    if (ev.code === "Enter") {
      if (cards && cards.length) {
        window.open(cards[0]?.url, "_blank");
        resetSearch();
      }
    }
    document.removeEventListener("keydown", onKeyEnter);
  };

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
          <SearchBar
            searchString={val}
            setSearchText={(t) => {
              setVal(t);
              handleSetSearch(t);
              document.addEventListener("keydown", onKeyEnter);
            }}
          />
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
