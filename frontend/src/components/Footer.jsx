import {
  Leaf,
  Globe,
  Mail,
  MapPin,
  Phone,
  Heart,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-20 bg-slate-900 text-gray-300">

      {/* Main Footer */}

      <div className="max-w-7xl mx-auto px-8 py-16 grid lg:grid-cols-4 md:grid-cols-2 gap-10">

        {/* Brand */}

        <div>

          <div className="flex items-center gap-3">

            <div className="bg-green-600 p-3 rounded-2xl">
              <Leaf className="text-white" size={28} />
            </div>

            <div>

              <h2 className="text-2xl font-bold text-white">
                YieldSense AI
              </h2>

              <p className="text-sm text-green-400">
                Smart Agriculture Platform
              </p>

            </div>

          </div>

          <p className="mt-6 leading-7 text-gray-400">

            YieldSense AI leverages Artificial Intelligence,
            Machine Learning, and Precision Agriculture to
            help farmers make smarter decisions, improve crop
            productivity, and maximize agricultural yield.

          </p>

        </div>

        {/* Quick Links */}

        <div>

          <h3 className="text-white text-xl font-semibold mb-5">
            Quick Links
          </h3>

          <ul className="space-y-3">

            <li className="hover:text-green-400 cursor-pointer">
              Home
            </li>

            <li className="hover:text-green-400 cursor-pointer">
              Crop Recommendation
            </li>

            <li className="hover:text-green-400 cursor-pointer">
              Yield Prediction
            </li>

            <li className="hover:text-green-400 cursor-pointer">
              Disease Detection
            </li>

            <li className="hover:text-green-400 cursor-pointer">
              Weather Intelligence
            </li>

          </ul>

        </div>

        

        {/* Contact */}

        <div>

          <h3 className="text-white text-xl font-semibold mb-5">
            Contact
          </h3>

          <div className="space-y-5">

            <div className="flex items-center gap-3">

              <Mail className="text-green-400" size={20} />

              <span>support@yieldsense.ai</span>

            </div>

            <div className="flex items-center gap-3">

              <Phone className="text-green-400" size={20} />

              <span>+91 999999999</span>

            </div>

            <div className="flex items-center gap-3">

              <MapPin className="text-green-400" size={20} />

              <span>Amaravati, Andhra Pradesh</span>

            </div>

            <div className="flex items-center gap-3">

              <Globe className="text-green-400" size={20} />

              <span>github.com/YieldSenseAI</span>

            </div>

          </div>

        </div>

      </div>

      {/* Bottom Footer */}

      <div className="border-t border-slate-700">

        <div className="max-w-7xl mx-auto px-8 py-6 flex flex-col md:flex-row justify-between items-center">

          <p className="text-gray-400 text-sm">

            © 2026 <span className="text-white font-semibold">
              YieldSense AI
            </span>. All Rights Reserved.

          </p>

          <p className="flex items-center gap-2 text-sm text-gray-400 mt-4 md:mt-0">

            Built with

            <Heart
              size={16}
              className="text-red-500 fill-red-500"
            />

            using React, FastAPI & AI

          </p>

        </div>

      </div>

    </footer>
  );
}