// Even larger text version
import { Link } from "react-router-dom";
import { MdEmail } from "react-icons/md";
import { FaPhoneSquareAlt } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { FaFacebookSquare } from "react-icons/fa";
import { AiFillInstagram } from "react-icons/ai";
import { FaTelegram } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
const Footer = () => {
    return (
        <footer className="bg-green-700 text-white mt-16">
            <div className="max-w-6xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

                    {/* Brand Section */}
                    <div>
                        <h2 className="text-4xl font-extrabold">
                            <span className="text-green-200 font-extrabold drop-shadow-[0_2px_10px_rgba(34,197,94,0.1)]">
                                Thaqefni
                            </span>
                        </h2>

                    </div>
                    {/* Contact Section */}
                    <div>                        <div className="space-y-3 text-lg text-green-100">
                        <p className="flex items-center gap-3">
                            <MdEmail className="text-green-300 text-2xl" />
                            <span>Email: contact@thaqefni.com</span>
                        </p>
                        <p className="flex items-center gap-3">
                            <FaPhoneSquareAlt className="text-green-300 text-2xl" />
                            <span>Phone: +213 123 456 789</span>
                        </p>
                        <p className="flex items-center gap-3">
                            <FaLocationDot className="text-green-300 text-2xl" />
                            <span>Location: Algeria</span>
                        </p>
                    </div>
                    </div>

                    {/* Social Media Section */}
                    <div>
                        <h3 className="text-3xl font-semibold mb-4 text-green-200">Follow Us</h3>
                        <div className="flex gap-4 text-2xl">
                            <a
                                href="#"
                                className="hover:text-green-300 transition-colors duration-300 bg-green-700 p-3 rounded-full hover:bg-green-600"
                                aria-label="Facebook"
                            >
                                <FaFacebookSquare />
                            </a>
                            <a
                                href="#"
                                className="hover:text-green-300 transition-colors duration-300 bg-green-700 p-3 rounded-full hover:bg-green-600"
                                aria-label="Instagram"
                            >
                                <AiFillInstagram />
                            </a>
                            <a
                                href="#"
                                className="hover:text-green-300 transition-colors duration-300 bg-green-700 p-3 rounded-full hover:bg-green-600"
                                aria-label="Telegram"
                            >
                                <FaTelegram />
                            </a>
                            <a
                                href="#"
                                className="hover:text-green-300 transition-colors duration-300 bg-green-700 p-3 rounded-full hover:bg-green-600"
                                aria-label="Twitter"
                            >
                                <FaSquareXTwitter />
                            </a>
                        </div>
                        <p className="text-green-100 text-lg mb-0 mt-3">
                            Stay connected with us on social media
                        </p>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-green-700 text-center  py-4 text-lg text-green-200">
                © {new Date().getFullYear()} Thaqefni. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;