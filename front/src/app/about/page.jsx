"use client";
import Image from "next/image";
import Footer from "@/app/comp/Footer"; // Adjust path as necessary

export default function About() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">About Us</h1>

      <section className="mb-8">
        <p className="text-lg">
          Welcome to SLAM Designs! We are a passionate team dedicated to
          providing high-quality 3D printing services. Our mission is to make 3D
          printing accessible to everyone and help bring ideas to life.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold">Our Mission</h2>
        <p className="text-lg">
          We aim to provide customers with affordable and efficient 3D printing
          services. Whether you're working on a personal project or need
          prototypes for your business, we have the tools and expertise to
          assist you.
        </p>
      </section>

      {/* FAQ Section moved here, under "Our Mission" */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          <div className="bg-gray-100 p-4 rounded-lg shadow">
            <h3 className="text-xl font-semibold">What is 3D printing?</h3>
            <p className="text-lg">
              3D printing is a process of making three-dimensional solid objects
              from a digital file. It allows you to create objects layer by
              layer, making it a great choice for custom designs, prototypes,
              and complex geometries.
            </p>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg shadow">
            <h3 className="text-xl font-semibold">
              How long does it take to complete an order?
            </h3>
            <p className="text-lg">
              The time required for printing depends on the complexity and size
              of the object. On average, a typical print can take between 3 to
              24 hours, but we always strive to meet your deadlines.
            </p>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg shadow">
            <h3 className="text-xl font-semibold">
              Can I modify my order after it's placed?
            </h3>
            <p className="text-lg">
              Once an order is placed, it enters our processing queue. However,
              if you need to make a change, please contact us immediately, and
              we will do our best to accommodate your request before printing
              begins.
            </p>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg shadow">
            <h3 className="text-xl font-semibold">
              What is the recycling process?
            </h3>
            <p className="text-lg">
              Our recycling service is straightforward—just send us your broken
              or unused 3D prints, and we'll recycle them to minimize plastic
              waste, helping contribute to a more sustainable future.
            </p>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg shadow">
            <h3 className="text-xl font-semibold">
              What file formats do you accept?
            </h3>
            <p className="text-lg">
              We only accept STL. If you have a different file format, please
              reach out to us, and we can assist you in converting it.
            </p>
          </div>
        </div>
      </section>
      <div>
        {/* Other content of your page */}

        <Footer />
      </div>
    </div>
  );
}
