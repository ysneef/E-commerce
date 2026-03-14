import React from "react";
import { Link } from "react-router-dom";

const SizeGuide = () => {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">

      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-black">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800 font-medium">Size Guide</span>
      </nav>

      {/* Title */}
      <h1 className="text-4xl font-bold text-center mb-10">
        Shoe Size Guide
      </h1>

      {/* How to measure */}
      <div className="grid md:grid-cols-2 gap-10 mb-16">
        <div>
          <h2 className="text-2xl font-semibold mb-4">
            How to Measure Your Foot
          </h2>

          <ol className="list-decimal pl-6 space-y-2 text-gray-700">
            <li>Place your foot on a sheet of paper.</li>
            <li>Mark the heel and the longest toe.</li>
            <li>Measure the distance between the marks.</li>
            <li>Compare the length with the size chart.</li>
          </ol>
        </div>
      </div>

      {/* Size Table */}
      <div>
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Size Conversion Chart
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 text-center">

            <thead className="bg-gray-100">
              <tr>
                <th className="border p-3">EU</th>
                <th className="border p-3">US</th>
                <th className="border p-3">UK</th>
                <th className="border p-3">Foot Length (cm)</th>
              </tr>
            </thead>

            <tbody>
              <tr><td className="border p-2">35.5</td><td className="border p-2">3.5</td><td className="border p-2">3</td><td className="border p-2">22.5</td></tr>
              <tr><td className="border p-2">36</td><td className="border p-2">4</td><td className="border p-2">3.5</td><td className="border p-2">23</td></tr>
              <tr><td className="border p-2">37</td><td className="border p-2">5</td><td className="border p-2">4</td><td className="border p-2">23.5</td></tr>
              <tr><td className="border p-2">38</td><td className="border p-2">6</td><td className="border p-2">5</td><td className="border p-2">24</td></tr>
              <tr><td className="border p-2">39</td><td className="border p-2">7</td><td className="border p-2">6</td><td className="border p-2">24.5</td></tr>
              <tr><td className="border p-2">40</td><td className="border p-2">8</td><td className="border p-2">7</td><td className="border p-2">25</td></tr>
              <tr><td className="border p-2">41</td><td className="border p-2">8.5</td><td className="border p-2">7.5</td><td className="border p-2">25.5</td></tr>
              <tr><td className="border p-2">42</td><td className="border p-2">9</td><td className="border p-2">8</td><td className="border p-2">26</td></tr>
              <tr><td className="border p-2">43</td><td className="border p-2">10</td><td className="border p-2">9</td><td className="border p-2">26.5</td></tr>
              <tr><td className="border p-2">44</td><td className="border p-2">11</td><td className="border p-2">10</td><td className="border p-2">27</td></tr>
              <tr><td className="border p-2">45</td><td className="border p-2">12</td><td className="border p-2">11</td><td className="border p-2">27.5</td></tr>
              <tr><td className="border p-2">46</td><td className="border p-2">13</td><td className="border p-2">12</td><td className="border p-2">28</td></tr>
            </tbody>

          </table>
        </div>
      </div>

      {/* Note */}
      <div className="mt-10 text-gray-600 text-center">
        If your foot is between two sizes, we recommend choosing the larger size
        for better comfort.
      </div>

    </div>
  );
};

export default SizeGuide;
