export async function listOrders() {
  const response = await fetch("/orders");
  if (!response.ok) throw new Error("Orders unavailable");
  return response.json();
}
