"use client"
import Link from "next/link";

const Footer = () => {
    return (
        <footer className='p-10 bg-gray-600 mx-auto'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-10 border-b border-gray-200 mb-8 pb-8'>

                <div className='space-y-4 md:ml-10 '>
                    <h2 className='font-semibold text-2xl text-blue-600 '>The Best Destination for Your Dream Vacation</h2>
                    <p className='text-lg text-white'>Escape to paradise with our handpicked selection of luxury resorts. From pristine beaches to majestic mountains, we have the perfect getaway waiting for you.</p>
                </div>
                <div className='space-y-4 md:ml-40 '>
                    <h3 className='font-semibold text-xl mb-4 text-blue-600'>Quick Links</h3>
                    <ul className='space-y-2 text-white'>
                        <li><Link href="/">Home</Link></li>
                        <li><Link href="/resorts">Resorts</Link></li>
                        <li><Link href="/bookings">My Bookings</Link></li>
                        <li><Link href="/about">About Us</Link></li>
                        <li><Link href="/contact">Contact Us</Link></li>
                    </ul>
                </div>
                <div className='space-y-4 md:ml-32 '>
                    <h3 className='font-semibold text-xl mb-4 text-blue-600'>Contact Us</h3>
                    <ul className='space-y-2 text-white'>
                        <li><a href="#">+91 1234567890</a></li>
                        <li><a href="#">[EMAIL_ADDRESS]</a></li>
                        <li><a href="#">123, Main Street, New York</a></li>
                    </ul>
                </div>
            </div>
            <div className="text-center text-white">
                <p>© 2025 Dream Escapes. All rights reserved.</p>
            </div>
        </footer>
    )
}

export default Footer