import { useState } from "react";
import { fetchAdminData } from "../../../utils/api";
import { useOnce } from "../../../utils/useOnce";

export const useData = () => {
  const [store, setState] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const data = await fetchAdminData();
    setState(data);
    setLoading(false);
  }

  useOnce(() => {
    fetchData();
  }, [])

  return {
    store,
    loading,
    reload: fetchData,
  }
}