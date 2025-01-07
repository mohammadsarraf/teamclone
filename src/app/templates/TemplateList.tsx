import { useRouter } from "next/navigation";

const templates = [
  {
    name: "Template 1",
    description: "Description of Template 1",
    thumbnail: "/images/Screenshot 2025-01-06 at 16.52.34.png", // Ensure this path is correct
  },
  {
    name: "Template 2",
    description: "Description of Template 2",
    thumbnail: "/images/Screenshot 2025-01-06 at 16.52.34.png", // Ensure this path is correct
  },
]

const TemplateList = () => {
	const router = useRouter();
  return (
    <section className="w-3/4 h-screen overflow-y-auto p-5 bg-white custom-scrollbar">
      <h2 className="text-xl font-bold mb-4 text-black">Templates</h2> {/* Added ml-4 to align with sidebar */}
      <div className="grid grid-cols-3 gap-3">
        {templates.map((template) => (
          <div key={template.name} className="border p-4 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 w-full hover:cursor-pointer" onClick={() => {router.push("/preview")}}>
            
            <img src={template.thumbnail} alt={template.name} className="w-full h-40 object-cover rounded-md mb-4"/>
            <h3 className="text-lg font-bold mb-2">{template.name}</h3>
            <p className="text-sm text-gray-600">{template.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TemplateList;
