import { useLocation, useParams } from "react-router-dom";

const DealsPage = () => {
  const location = useLocation();
  const { id } = useParams();
  const product = location.state?.product; // Access product data

  if (!product) {
    return <p className="text-center text-gray-600">Product not found.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold">{product.name}</h2>
      <img
        src={`http://localhost:8080/${product.images[0]}`}
        alt={product.name}
        className="w-full h-64 object-cover rounded-lg mt-4"
      />
      <p className="text-lg mt-4">{product.description}</p>
      <p className="text-2xl font-semibold mt-2">Rs.{product.price}</p>
    </div>
  );
};

export default DealsPage;
