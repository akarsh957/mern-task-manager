import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Card from "../components/ui/Card";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    setLoading(true);
    setError("");
    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password,
      });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-[10%] right-[10%] w-[400px] h-[400px] bg-accent-purple/20 rounded-full blur-[80px] animate-float"></div>
      <div className="absolute bottom-[10%] left-[10%] w-[400px] h-[400px] bg-accent-blue/20 rounded-full blur-[80px] animate-float delay-700"></div>

      <Card className="w-[400px] p-8 relative z-10">
        <h2 className="text-3xl font-bold text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">Create Account</h2>
        <p className="text-center text-gray-400 mb-8">Join us to manage your tasks efficiently</p>

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/10 border border-red-500/50 text-red-200 text-sm text-center p-3 rounded-lg mb-6"
          >
            {error}
          </motion.p>
        )}

        <div className="space-y-4">
          <Input
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            onClick={handleRegister}
            className="w-full mt-4"
            isLoading={loading}
          >
            Get Started
          </Button>
        </div>

        <p className="text-sm text-center mt-8 text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-accent-blue hover:text-accent-purple transition-colors font-medium">
            Sign in
          </Link>
        </p>
      </Card>
    </div>
  );
};

export default Register;