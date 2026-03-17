import React from "react";
import { Link } from "react-router-dom";
import { Breadcrumb } from 'antd';


/* ✅ Size Map EU */
const sizeMap: Record<string, number[]> = {
  Men: [38,38.5,39,39.5,40,40.5,41,41.5,42,42.5,43,43.5,44,44.5,45,45.5,46,47],
  Women: [35,35.5,36,36.5,37,37.5,38,38.5,39,39.5,40,40.5,41,41.5,42],
  Kids: [21,22,23,24,25,26,27,28,29,30,31,32,33,34,35]
};

/* ✅ Mapping chuẩn */
const sizeGuide = {
  men: {
    38: { us: "5.5", uk: "5", foot: "23.7" },
    38.5: { us: "6", uk: "5.5", foot: "24.1" },
    39: { us: "6.5", uk: "6", foot: "24.5" },
    39.5: { us: "7", uk: "6", foot: "25" },
    40: { us: "7.5", uk: "6.5", foot: "25.4" },
    40.5: { us: "8", uk: "7", foot: "25.8" },
    41: { us: "8.5", uk: "7.5", foot: "26.2" },
    41.5: { us: "9", uk: "8", foot: "26.7" },
    42: { us: "9.5", uk: "8.5", foot: "27.1" },
    42.5: { us: "10", uk: "9", foot: "27.5" },
    43: { us: "10.5", uk: "9.5", foot: "27.9" },
    43.5: { us: "11", uk: "10", foot: "28.3" },
    44: { us: "11.5", uk: "10.5", foot: "28.8" },
    44.5: { us: "12", uk: "11", foot: "29.2" },
    45: { us: "12.5", uk: "11.5", foot: "29.6" },
    45.5: { us: "13", uk: "12", foot: "30" },
    46: { us: "13.5", uk: "12.5", foot: "30.5" },
    47: { us: "14", uk: "13", foot: "30.9" }
  },

  women: {
    35: { us: "4.5", uk: "2", foot: "21.6" },
    35.5: { us: "5", uk: "2.5", foot: "22" },
    36: { us: "5.5", uk: "3", foot: "22.4" },
    36.5: { us: "6", uk: "3.5", foot: "22.9" },
    37: { us: "6.5", uk: "4", foot: "23.3" },
    37.5: { us: "7", uk: "4.5", foot: "23.7" },
    38: { us: "7.5", uk: "5", foot: "24.1" },
    38.5: { us: "8", uk: "5.5", foot: "24.5" },
    39: { us: "8.5", uk: "6", foot: "25" },
    39.5: { us: "9", uk: "6.5", foot: "25.4" },
    40: { us: "9.5", uk: "7", foot: "25.8" },
    40.5: { us: "10", uk: "7.5", foot: "26.2" },
    41: { us: "10.5", uk: "8", foot: "26.7" },
    41.5: { us: "11", uk: "8.5", foot: "27.1" },
    42: { us: "11.5", uk: "9", foot: "27.5" }
  },

  kids: {
    21: { us: "5", uk: "4.5", foot: "12.5" },
    22: { us: "6", uk: "5.5", foot: "13.3" },
    23: { us: "7", uk: "6.5", foot: "14.2" },
    24: { us: "7.5", uk: "7", foot: "14.6" },
    25: { us: "8", uk: "7.5", foot: "15" },
    26: { us: "9", uk: "8.5", foot: "15.9" },
    27: { us: "10", uk: "9.5", foot: "16.7" },
    28: { us: "11", uk: "10.5", foot: "17.6" },
    29: { us: "11.5", uk: "11", foot: "18" },
    30: { us: "12.5", uk: "12", foot: "18.8" },
    31: { us: "13", uk: "12.5", foot: "19.3" },
    32: { us: "1", uk: "13.5", foot: "20.1" },
    33: { us: "1.5", uk: "1", foot: "20.5" },
    34: { us: "2.5", uk: "2", foot: "21.4" },
    35: { us: "3", uk: "2.5", foot: "21.8" }
  }
};

const SizeGuide = () => {
  return (
    <div className="max-w-screen-xl mx-auto pt-20 pb-10">
      <div className="my-5">
        <Breadcrumb
          separator=">"
          items={[
            {
              title: 'Home',
              href: '/',
            },
            {
              title: 'Size Guide',
            },
          ]}
        />
      </div>

      <h1 className="text-4xl font-bold text-center mb-10">
        Shoe Size Guide
      </h1>

      <div className="space-y-16">
        {Object.entries(sizeMap).map(([group, sizes]) => {
          const key = group.toLowerCase() as "men" | "women" | "kids";

          return (
            <div key={group}>
              <h2 className="text-2xl font-semibold mb-6 text-center">
                {group}'s Size Chart
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full border text-center">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border p-3">EU</th>
                      <th className="border p-3">US</th>
                      <th className="border p-3">UK</th>
                      <th className="border p-3">Foot Length (cm)</th>
                    </tr>
                  </thead>

                  <tbody>
                    {sizes.map((eu) => {
                      const data = sizeGuide[key][eu as keyof typeof sizeGuide[typeof key]];

                      return (
                        <tr key={eu}>
                          <td className="border p-2">EU {eu}</td>
                          <td className="border p-2">{data?.us || "-"}</td>
                          <td className="border p-2">{data?.uk || "-"}</td>
                          <td className="border p-2">{data?.foot || "-"}</td>
                        </tr>
                      );
                    })}
                  </tbody>

                </table>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-12 text-gray-600 text-center">
        If your foot measurement is between two sizes, choose the larger size.
      </div>

    </div>
  );
};

export default SizeGuide;
