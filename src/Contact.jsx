// Contact.jsx - Contact page inspired by Al Jazeera
import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Send, MessageCircle, Clock, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

const Contact = () => {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        subject: "",
        message: ""
    });
    const [errors, setErrors] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
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
        
        if (!formData.subject) {
            newErrors.subject = "Subject is required";
        }
        
        if (!formData.message) {
            newErrors.message = "Message is required";
        } else if (formData.message.length < 10) {
            newErrors.message = "Message must be at least 10 characters";
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
            setIsSubmitted(true);
            setFormData({
                fullName: "",
                email: "",
                subject: "",
                message: ""
            });
            // Reset success message after 5 seconds
            setTimeout(() => setIsSubmitted(false), 5000);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-white">
          

            {/* Header */}
                    <div className="m-10">
                      <h1 className="text-4xl sm:text-6xl font-bold text-green-800 mb-2 border-l-4 border-green-700 pl-4 flex items-center gap-2">
                       Conatact Us
                      </h1>
                      <p className="text-gray-600 ml-6 text-l">
                        We're here to answer your questions and listen to your suggestions
                      </p>
                    </div>

            {/* Contact Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Contact Info */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-gray-50 rounded-xl p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h3>
                            
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <Mail className="h-5 w-5 text-green-700 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-gray-900">Email</p>
                                        <a href="mailto:contact@pmap.com" className="text-gray-600 hover:text-green-700">
                                            contact@pmap.com
                                        </a>
                                    </div>
                                </div>
                                
                                <div className="flex items-start gap-3">
                                    <Phone className="h-5 w-5 text-green-700 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-gray-900">Phone</p>
                                        <a href="tel:+213123456789" className="text-gray-600 hover:text-green-700">
                                            +213 (0) 23 45 67 89
                                        </a>
                                    </div>
                                </div>
                                
                                <div className="flex items-start gap-3">
                                    <MapPin className="h-5 w-5 text-green-700 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-gray-900">Address</p>
                                        <p className="text-gray-600">
                                            Ben Aknoun District,<br />
                                            Algiers, Algeria
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start gap-3">
                                    <Clock className="h-5 w-5 text-green-700 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-gray-900">Business Hours</p>
                                        <p className="text-gray-600">
                                            Monday - Friday: 9:00 AM - 6:00 PM<br />
                                            Saturday: 9:00 AM - 1:00 PM
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="bg-gray-50 rounded-xl p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Follow Us</h3>
                            <div className="flex gap-3">
                                <a href="#" className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow">
                                    <Facebook className="h-5 w-5 text-blue-600" />
                                </a>
                                <a href="#" className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow">
                                    <Twitter className="h-5 w-5 text-blue-400" />
                                </a>
                                <a href="#" className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow">
                                    <Linkedin className="h-5 w-5 text-blue-700" />
                                </a>
                                <a href="#" className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow">
                                    <Instagram className="h-5 w-5 text-pink-600" />
                                </a>
                            </div>
                        </div>

                        {/* FAQ Link */}
                        <div className="bg-green-50 rounded-xl p-6 border border-green-100">
                            <MessageCircle className="h-8 w-8 text-green-700 mb-3" />
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Frequently Asked Questions?</h3>
                            <p className="text-sm text-gray-600 mb-3">
                                Check our FAQ to find quick answers
                            </p>
                            <Link to="/faq" className="text-green-700 font-medium hover:underline text-sm">
                                View FAQ →
                            </Link>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 md:p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Send Us a Message</h2>
                            <p className="text-gray-600 mb-6">
                                We'll get back to you as soon as possible
                            </p>

                            {isSubmitted && (
                                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                                    <p className="text-green-700 text-sm">
                                        ✅ Your message has been sent successfully! We'll respond within 24-48 hours.
                                    </p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            id="fullName"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-2 border ${errors.fullName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                                            placeholder="your name"
                                        />
                                        {errors.fullName && (
                                            <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                                        )}
                                    </div>
                                    
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                                            placeholder="ahmed@example.com"
                                        />
                                        {errors.email && (
                                            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                                        Subject *
                                    </label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-2 border ${errors.subject ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                                        placeholder="Question about an article / Suggestion / Technical support"
                                    />
                                    {errors.subject && (
                                        <p className="mt-1 text-sm text-red-600">{errors.subject}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                        Message *
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        rows="6"
                                        value={formData.message}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-2 border ${errors.message ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none`}
                                        placeholder="Your message here..."
                                    ></textarea>
                                    {errors.message && (
                                        <p className="mt-1 text-sm text-red-600">{errors.message}</p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-green-700 text-white rounded-lg font-medium hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {isLoading ? (
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    ) : (
                                        <>
                                            <Send className="h-4 w-4" />
                                            Send Message
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Map Section */}
            <div className="border-t border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Our Location</h3>
                    <div className="bg-gray-200 rounded-xl h-64 flex items-center justify-center">
                        <div className="text-center">
                            <MapPin className="h-10 w-10 text-green-700 mx-auto mb-2" />
                            <p className="text-gray-500">Algiers, Algeria</p>
                            <p className="text-sm text-gray-400 mt-1">[Interactive map to integrate]</p>
                        </div>
                    </div>
                </div>
            </div>

            
        </div>
    );
};

export default Contact;