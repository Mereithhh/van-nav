import { fetchGetEnabledSearchEngines } from './api';

// 搜索引擎缓存
let searchEnginesCache: any[] = [];
let cacheExpiry = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5分钟缓存

// 获取启用的搜索引擎
const getEnabledSearchEngines = async () => {
  const now = Date.now();
  
  // 如果缓存有效，直接返回缓存
  if (searchEnginesCache.length > 0 && now < cacheExpiry) {
    return searchEnginesCache;
  }
  
  try {
    // 从API获取数据
    searchEnginesCache = await fetchGetEnabledSearchEngines();
    cacheExpiry = now + CACHE_DURATION;
    return searchEnginesCache;
  } catch (error) {
    console.error('获取搜索引擎失败，使用默认配置:', error);
    
    // 如果API调用失败，使用默认搜索引擎配置
    const defaultEngines = [
      {
        id: 1,
        name: "百度",
        baseUrl: "https://www.baidu.com/s",
        queryParam: "wd",
        logo: "baidu.ico",
        sort: 1,
        enabled: true
      },
      {
        id: 2,
        name: "Bing",
        baseUrl: "https://cn.bing.com/search",
        queryParam: "q",
        logo: "bing.ico",
        sort: 2,
        enabled: true
      },
      {
        id: 3,
        name: "Google",
        baseUrl: "https://www.google.com/search",
        queryParam: "q",
        logo: "google.ico",
        sort: 3,
        enabled: true
      }
    ];
    
    searchEnginesCache = defaultEngines;
    cacheExpiry = now + CACHE_DURATION;
    return defaultEngines;
  }
};

// 生成搜索引擎卡片
export const generateSearchEngineCard = async (searchString: string) => {
  if (!searchString.trim()) return [];
  
  try {
    const engines = await getEnabledSearchEngines();
    
    return engines
      .filter(engine => engine.enabled)
      .sort((a, b) => a.sort - b.sort)
      .map((engine, index) => ({
        name: `使用 ${engine.name} 搜索`,
        url: generateSearchUrl(engine.baseUrl, engine.queryParam, searchString),
        desc: `在 ${engine.name} 中搜索 「${searchString}」`,
        id: 8800880000 + engine.id, // 使用特定的ID前缀避免冲突
        logo: engine.logo,
        hide: false
      }));
  } catch (error) {
    console.error('生成搜索引擎卡片失败:', error);
    return [];
  }
};

// 生成搜索URL
const generateSearchUrl = (baseUrl: string, queryParam: string, searchString: string) => {
  const separator = baseUrl.includes('?') ? '&' : '?';
  return `${baseUrl}${separator}${queryParam}=${encodeURIComponent(searchString)}`;
};

// 清除缓存（当管理员修改搜索引擎配置时调用）
export const clearSearchEngineCache = () => {
  searchEnginesCache = [];
  cacheExpiry = 0;
};