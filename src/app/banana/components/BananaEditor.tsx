import FooterEdit from "./BananaFooterEditor";
import HeaderEdit from "./BananaHeaderEditor";
import MainEdit from "./BananaContentEditor";

export default function BananaEditor({
  isFullscreen,
}: {
  isFullscreen: boolean;
}) {
  return (
    <div
      className={`flex flex-1 flex-col ${isFullscreen ? "" : "rounded-b-lg"} bg-red-400`}
    >
      <HeaderEdit isFullscreen={isFullscreen} />
      <MainEdit />
      <div className="flex-1">
        <FooterEdit />
      </div>
    </div>
  );
}
