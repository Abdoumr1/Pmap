// Signup.jsx - Signup page inspired by Al Jazeera
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff, UserPlus, CheckCircle, XCircle } from 'lucide-react';

const Signup = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        acceptTerms: false
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);

    // Check password strength
    const checkPasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 6) strength++;
        if (password.match(/[a-z]+/)) strength++;
        if (password.match(/[A-Z]+/)) strength++;
        if (password.match(/[0-9]+/)) strength++;
        if (password.match(/[$@#&!]+/)) strength++;
        setPasswordStrength(strength);
        return strength;
    };

    // Handle input changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === "checkbox" ? checked : value;
        
        setFormData({
            ...formData,
            [name]: newValue
        });
        
        // Check password strength
        if (name === "password") {
            checkPasswordStrength(value);
        }
        
        // Clear error for this field
        if (errors[name]) {
            setErrors({ ...errors, [name]: "" });
        }
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.fullName) {
            newErrors.fullName = "Full name is required";
        } else if (formData.fullName.length < 3) {
            newErrors.fullName = "Name must be at least 3 characters";
        }
        
        if (!formData.email) {
            newErrors.email = "Email address is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address";
        }
        
        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        } else if (passwordStrength < 3) {
            newErrors.password = "Password is too weak";
        }
        
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password";
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }
        
        if (!formData.acceptTerms) {
            newErrors.acceptTerms = "You must accept the terms and conditions";
        }
        
        return newErrors;
    };

    // Handle submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validateForm();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsLoading(true);
        
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            console.log("Signup data:", formData);
            navigate("/login");
        }, 1500);
    };

    // Get password strength text and color
    const getStrengthInfo = () => {
        if (passwordStrength === 0) return { text: "Enter a password", color: "bg-gray-200" };
        if (passwordStrength === 1) return { text: "Very weak", color: "bg-red-500" };
        if (passwordStrength === 2) return { text: "Weak", color: "bg-orange-500" };
        if (passwordStrength === 3) return { text: "Medium", color: "bg-yellow-500" };
        if (passwordStrength === 4) return { text: "Strong", color: "bg-green-500" };
        return { text: "Very strong", color: "bg-green-700" };
    };

    const strengthInfo = getStrengthInfo();

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            
            {/* Signup Form */}
            <div className="flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
                    {/* Header */}
                    <div className="text-center">
                        <div className="mx-auto h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <UserPlus className="h-6 w-6 text-green-700" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            Create an Account
                        </h2>
                        <p className="text-sm text-gray-600">
                            Join P-MAP and discover inspiring articles
                        </p>
                    </div>

                    {/* Form */}
                    <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                        {/* Full Name */}
                        <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="fullName"
                                    name="fullName"
                                    type="text"
                                    autoComplete="name"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    className={`block w-full pl-10 pr-3 py-2 border ${errors.fullName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                                    placeholder="your name"
                                />
                            </div>
                            {errors.fullName && (
                                <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`block w-full pl-10 pr-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                                    placeholder="you@example.com"
                                />
                            </div>
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="new-password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`block w-full pl-10 pr-10 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    )}
                                </button>
                            </div>
                            
                            {/* Password strength indicator */}
                            {formData.password && (
                                <div className="mt-2">
                                    <div className="flex gap-1 h-1.5 mb-1">
                                        {[1, 2, 3, 4, 5].map((level) => (
                                            <div
                                                key={level}
                                                className={`flex-1 rounded-full transition-all ${
                                                    level <= passwordStrength ? strengthInfo.color : 'bg-gray-200'
                                                }`}
                                            ></div>
                                        ))}
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        Password strength: <span className="font-medium">{strengthInfo.text}</span>
                                    </p>
                                </div>
                            )}
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    autoComplete="new-password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className={`block w-full pl-10 pr-10 py-2 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    )}
                                </button>
                            </div>
                            {formData.confirmPassword && formData.password === formData.confirmPassword && (
                                <p className="mt-1 text-xs text-green-600 flex items-center gap-1">
                                    <CheckCircle className="h-3 w-3" />
                                    Passwords match
                                </p>
                            )}
                            {errors.confirmPassword && (
                                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                            )}
                        </div>

                        {/* Terms and conditions */}
                        <div className="flex items-start">
                            <div className="flex items-center h-5">
                                <input
                                    id="acceptTerms"
                                    name="acceptTerms"
                                    type="checkbox"
                                    checked={formData.acceptTerms}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                />
                            </div>
                            <label htmlFor="acceptTerms" className="ml-2 text-sm text-gray-600">
                                I accept the{" "}
                                <Link to="/terms" className="text-green-700 hover:text-green-800">
                                    Terms of Use
                                </Link>{" "}
                                and{" "}
                                <Link to="/privacy" className="text-green-700 hover:text-green-800">
                                    Privacy Policy
                                </Link>
                            </label>
                        </div>
                        {errors.acceptTerms && (
                            <p className="mt-1 text-sm text-red-600">{errors.acceptTerms}</p>
                        )}

                        {/* Submit button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isLoading ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            ) : (
                                "Create Account"
                            )}
                        </button>

                        {/* Login link */}
                        <p className="text-center text-sm text-gray-600">
                            Already have an account?{" "}
                            <Link to="/login" className="font-medium text-green-700 hover:text-green-800">
                                Sign In
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Signup;