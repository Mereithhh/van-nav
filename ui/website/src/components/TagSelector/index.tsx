import "./index.css";
import { useCallback } from "react";
interface TagSelectorProps {
  tags: any;
  onTagChange: (newTag: string) => void;
  currTag: string;
}
const TagSelector = (props: TagSelectorProps) => {
  const { tags = ["all"], onTagChange, currTag } = props;
  const renderTags = useCallback(() => {
    const originTags =  tags.map((each) => {
      return (
        <span
          className={`select-tag ${
            currTag === each ? "select-tag-active" : ""
          }`}
          key={`${each}-select-tag`}
          onClick={() => {
            onTagChange(each);
          }}
        >
          {each}
        </span>
      );
    });
    return originTags;
  }, [tags, onTagChange, currTag]);
  return (
    <div className="tag-selector span-3">
      <div className="tag-selector-wrapper">
        {renderTags()}
      </div>
    </div>
  );
};

export default TagSelector;
