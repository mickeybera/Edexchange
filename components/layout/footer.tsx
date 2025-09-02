"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Mail, Heart } from 'lucide-react';

export default function Footer() {
  const quickLinks = [
    { href: '/browse', label: 'Browse' },
    { href: '/sell', label: 'Sell' },
    { href: '/notes', label: 'Notes' },
    { href: '/events', label: 'Events' },
  ];

  return (
    <footer className="bg-background border-t border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <motion.h3 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            >
              eduXchange
            </motion.h3>
            <p className="text-muted-foreground">
              The ultimate student marketplace for books, engineering kits, and study materials.
            </p>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span>work.4bytes@gmail.com</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold">Quick Links</h4>
            <div className="grid grid-cols-2 gap-2">
              {quickLinks.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-semibold">Connect</h4>
            <p className="text-sm text-muted-foreground">
              Join thousands of students buying and selling academic materials safely and securely.
            </p>
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-500" />
              <span>for students</span>
            </div>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-8 pt-8 border-t border-border/50 text-center text-sm text-muted-foreground"
        >
          <p>© {new Date().getFullYear()} Team 4Bytes. All rights reserved.</p>
        </motion.div>
      </div>
    </footer>
  );
}