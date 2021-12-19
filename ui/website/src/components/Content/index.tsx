
import {ToolDataList, ToolDataItem } from '../../data/type';
import './index.scss';
import Card from '../Card';

interface ContentProps {
  curr: string;
  data: ToolDataList[];
}


const Content = (props:ContentProps) => {
  const { curr, data } = props;
  const renderCards = () => {
    if (data) {
      const currData: ToolDataItem[] = data.find((item) => item.type === curr).list;
      return currData.map((item) => {
        return <Card title={item.title} url={item.url} des={item.des} logo={item.logo} key={item.title} />
      });
    }
  };

  return (
    <div className="content">
      {renderCards()}
    </div>
  );
}

export default Content;