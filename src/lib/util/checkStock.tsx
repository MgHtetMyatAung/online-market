export function checkStock(stock: number, quantity: number) {
  if (stock < quantity && stock !== 0) {
    return (
      <span
        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800`}
      >
        {stock}
      </span>
    );
  }
  if (stock > quantity) {
    return (
      <span
        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800`}
      >
        {stock}
      </span>
    );
  }
  return (
    <span
      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-red-800`}
    >
      out of stock
    </span>
  );
}
