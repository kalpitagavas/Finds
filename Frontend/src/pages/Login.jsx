import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    adminSecretKey: "",
  });
  const [error, setError] = useState("");

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setFormData({ username: "", email: "", password: "", adminSecretKey: "" });
    setError("");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      let response;

      if (isLogin) {
        response = await authService.Login(formData.email, formData.password);
        console.log("res",response)
      } else {
        const userExists = await authService.CheckUserExists(formData.email);
        if (userExists) {
          setError("User already exists. Please log in.");
          return;
        }
        response = await authService.Register(
          formData.username,
          formData.email,
          formData.password,
          formData.adminSecretKey
        );
      }

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userName", response.data.user.username);
      localStorage.setItem("role", response.data.user.role); // Save role for later use

      toast.success(`${isLogin ? "Login" : "Registration"} successful`, { autoClose: 1000 });

      navigate("../Dashboard");
    } catch (err) {
      console.error(`Error during ${isLogin ? "login" : "registration"}:`, err);
      setError(err.response?.data?.message || err.message);
      toast.error(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
         style={{ backgroundImage: "url('/src/assets/bg1.jpg')" }}>
      <div className="absolute inset-0 bg-white/30 backdrop-blur-sm"></div>
      <div className="relative z-10 bg-white p-8 rounded-[2.5rem] shadow-xl w-full max-w-[24rem]">
        <h2 className="text-orange-900 text-2xl font-bold text-center mb-6">
          {isLogin ? "Login to Your Account" : "Create a New Account"}
        </h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                <input type="text" id="username" name="username" value={formData.username} onChange={handleChange}
                       className="mt-1 block w-full px-3 py-2 text-black border-b border-orange-900 rounded-md shadow-sm focus:ring-orange-900 focus:outline-none"
                       placeholder="Your Username" required />
              </div>

              <div>
                <label htmlFor="adminSecretKey" className="block text-sm font-medium text-gray-700">
                  Admin Secret Key (Optional)
                </label>
                <input type="text" id="adminSecretKey" name="adminSecretKey" value={formData.adminSecretKey}
                       onChange={handleChange} className="mt-1 block w-full px-3 py-2 text-black border-b border-orange-900 rounded-md shadow-sm focus:ring-orange-900 focus:outline-none"
                       placeholder="Enter Admin Key (if applicable)" />
              </div>
            </>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange}
                   className="mt-1 block w-full px-3 py-2 text-black border-b border-orange-900 rounded-md shadow-sm focus:ring-orange-900 focus:outline-none"
                   placeholder="you@example.com" required />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" id="password" name="password" value={formData.password} onChange={handleChange}
                   className="mt-1 block w-full px-3 py-2 text-black border-b border-orange-900 rounded-md shadow-sm focus:ring-orange-900 focus:outline-none"
                   placeholder="********" required />
          </div>

          <button type="submit" className="w-full text-white flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium bg-orange-900 hover:bg-orange-950 focus:ring-2 focus:outline-none transition-all duration-300 hover:scale-105">
            {isLogin ? "Sign In" : "Sign Up"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button onClick={toggleForm} className="font-medium text-orange-900 hover:text-orange-700">
            {isLogin ? "Sign Up" : "Sign In"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;
