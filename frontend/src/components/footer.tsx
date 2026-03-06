import Image from "next/image";
import Link from "next/link";
import { Instagram, Linkedin, Twitter } from "lucide-react";

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-50 border-t border-gray-200 pt-16 pb-8">
            <div className="container mx-auto px-4 md:px-8 max-w-[1200px]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">

                    {/* Column 1 - Brand */}
                    <div className="lg:col-span-1">
                        <Link href="/" className="inline-block mb-6">
                            <Image
                                src="/24HR_logo.jpg"
                                alt="24HR Status Promotion Logo"
                                width={48}
                                height={48}
                                className="rounded-lg shadow-sm"
                            />
                        </Link>
                        <h3 className="text-[18px] font-semibold text-[#0F172A] mb-3">24HR Status Promotion</h3>
                        <p className="text-[14px] text-[#475569] leading-relaxed max-w-[280px]">
                            Helping businesses grow through structured 24-hour cross promotion. A smart, cost-effective way to promote your brand daily on WhatsApp, Instagram, and Facebook stories.
                        </p>
                    </div>

                    {/* Column 2 - Quick Links */}
                    <div>
                        <h4 className="text-[16px] font-semibold text-[#0F172A] mb-6">Quick Links</h4>
                        <ul className="space-y-3">
                            {[
                                { name: "Home", href: "/" },
                                { name: "How It Works", href: "#how-it-works" },
                                { name: "Why Choose Us", href: "#why-choose-us" },
                                { name: "For Businesses", href: "#for-businesses" },
                                { name: "Pricing (Coming Soon)", href: "#" },
                                { name: "Dashboard (Login)", href: "/login" },
                            ].map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-[14px] text-[#475569] hover:text-[#2563EB] transition-colors duration-200"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3 - Platform */}
                    <div>
                        <h4 className="text-[16px] font-semibold text-[#0F172A] mb-6">Platform</h4>
                        <ul className="space-y-3">
                            {[
                                "Upload Your Banner",
                                "Promotion Requests",
                                "Mutual Approval System",
                                "Analytics Dashboard",
                                "Trust Score System",
                                "Leaderboard",
                            ].map((item) => (
                                <li key={item}>
                                    <Link
                                        href="#"
                                        className="text-[14px] text-[#475569] hover:text-[#2563EB] transition-colors duration-200"
                                    >
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 4 - Legal */}
                    <div>
                        <h4 className="text-[16px] font-semibold text-[#0F172A] mb-6">Legal</h4>
                        <ul className="space-y-3">
                            {[
                                "Terms & Conditions",
                                "Privacy Policy",
                                "Refund Policy",
                                "Disclaimer",
                                "Cookie Policy",
                            ].map((item) => (
                                <li key={item}>
                                    <Link
                                        href="#"
                                        className="text-[14px] text-[#475569] hover:text-[#2563EB] transition-colors duration-200"
                                    >
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 5 - Contact */}
                    <div>
                        <h4 className="text-[16px] font-semibold text-[#0F172A] mb-6">Contact Us</h4>
                        <div className="space-y-4 mb-8">
                            <div>
                                <p className="text-[12px] font-bold text-[#94A3B8] uppercase tracking-wider mb-1">Support Email</p>
                                <a
                                    href="mailto:support@24hrstatuspromotion.com"
                                    className="text-[14px] text-[#475569] hover:text-[#2563EB] transition-colors break-all"
                                >
                                    support@24hrstatuspromotion.com
                                </a>
                            </div>
                            <div>
                                <p className="text-[12px] font-bold text-[#94A3B8] uppercase tracking-wider mb-1">Business Inquiries</p>
                                <a
                                    href="mailto:business@24hrstatuspromotion.com"
                                    className="text-[14px] text-[#475569] hover:text-[#2563EB] transition-colors break-all"
                                >
                                    business@24hrstatuspromotion.com
                                </a>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            {[
                                { icon: Instagram, href: "#" },
                                { icon: Linkedin, href: "#" },
                                { icon: Twitter, href: "#" },
                            ].map((social, i) => (
                                <Link
                                    key={i}
                                    href={social.href}
                                    className="p-2 rounded-full bg-white border border-gray-200 text-[#475569] hover:text-[#2563EB] hover:border-[#2563EB] hover:scale-110 transition-all duration-200 shadow-sm"
                                >
                                    <social.icon size={18} />
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="pt-8 border-t border-gray-200 flex flex-col items-center text-center">
                    <p className="text-[14px] text-[#64748B] mb-4">
                        &copy; {currentYear} 24HR Status Promotion. All Rights Reserved.
                    </p>
                    <p className="text-[13px] text-[#94A3B8] max-w-[900px] leading-relaxed">
                        24HR Status Promotion is a barter-based 24-hour marketing platform that helps businesses grow through WhatsApp status marketing, Instagram story promotion, and structured cross-business collaborations.
                    </p>
                </div>
            </div>
        </footer>
    );
}
