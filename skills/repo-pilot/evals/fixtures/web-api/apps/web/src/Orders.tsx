import { useEffect, useState } from "react";
import { listOrders } from "./api";
export function Orders() {
  const [orders, setOrders] = useState<{id:string}[]>([]);
  useEffect(() => { listOrders().then(setOrders); }, []);
  return <ul>{orders.map(o => <li key={o.id}>{o.id}</li>)}</ul>;
}
