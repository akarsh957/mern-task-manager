import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { loginUser, googleLogin } from "../api/authApi";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Card from "../components/ui/Card";
import { GoogleLogin } from "@react-oauth/google";

const Login = () => {
  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await loginUser({ email, password });

      dispatch({
        type: "LOGIN",
        payload: res.data,
      });

      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await googleLogin(credentialResponse.credential);
      dispatch({
        type: "LOGIN",
        payload: res.data,
      });
      navigate("/dashboard");
    } catch (err) {
      setError("Google login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated background mesh */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-20%] left-[-15%] w-[600px] h-[600px] bg-accent-cyan/15 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute top-[30%] right-[-10%] w-[500px] h-[500px] bg-accent-violet/20 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-[-15%] left-[20%] w-[400px] h-[400px] bg-accent-rose/10 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>

      <Card className="w-[420px] p-8 relative z-10">
        {/* Shimmer top accent */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent-cyan to-transparent opacity-60"></div>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gradient mb-2">Welcome Back</h2>
          <p className="text-gray-500 text-sm">Enter your credentials to access your workspace</p>
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-accent-rose/10 border border-accent-rose/30 text-accent-rose text-sm text-center p-3 rounded-xl mb-6"
          >
            {error}
          </motion.p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoCapitalize="none"
          />

          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button
            type="submit"
            className="w-full mt-4"
            isLoading={loading}
          >
            Sign In
          </Button>
        </form>

        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-glass-200"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-dark-800/80 px-3 text-gray-500 tracking-wider">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError("Google Login Failed")}
              theme="filled_black"
              shape="circle"
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Login;
