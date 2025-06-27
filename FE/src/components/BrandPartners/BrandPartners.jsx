import React from "react";

const brands = [
  {
    name: "Daikin",
    logo: "https://cdn.freebiesupply.com/logos/large/2x/daikin-logo-png-transparent.png",
  },
  {
    name: "Panasonic",
    logo: "https://cdn.freebiesupply.com/logos/large/2x/panasonic-logo-png-transparent.png",
  },
  {
    name: "Samsung",
    logo: "https://cdn.freebiesupply.com/logos/large/2x/samsung-4-logo-png-transparent.png",
  },
  {
    name: "LG",
    logo: "https://cdn.freebiesupply.com/logos/large/2x/lg-logo-png-transparent.png",
  },
  {
    name: "Toshiba",
    logo: "https://cdn.freebiesupply.com/logos/large/2x/toshiba-logo-png-transparent.png",
  },
  {
    name: "Electrolux",
    logo: "https://cdn.freebiesupply.com/logos/large/2x/electrolux-logo-png-transparent.png",
  },
  {
    name: "Sharp",
    logo: "https://cdn.freebiesupply.com/logos/large/2x/sharp-logo-png-transparent.png",
  },
  {
    name: "Hitachi",
    logo: "https://cdn.freebiesupply.com/logos/large/2x/hitachi-logo-png-transparent.png",
  },
];

function BrandPartners() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Đối tác thương hiệu
          </h2>
          <p className="text-lg text-gray-600">
            Chúng tôi là đối tác dịch vụ ủy quyền của các thương hiệu hàng đầu
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
          {brands.map((brand) => (
            <div
              key={brand.name}
              className="flex items-center justify-center p-8 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
              data-aos="fade-up">
              <div className="w-32 h-16 relative">
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="absolute inset-0 w-full h-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default BrandPartners;
