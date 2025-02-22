import FooterEdit from "./BananaFooterEditor";
import HeaderEdit from "./BananaHeaderEditor";
import MainEdit from "./BananaContentEditor";

export default function BananaEditor({
  isFullscreen,
}: {
  isFullscreen: boolean;
}) {
  return (
    <div className="flex h-full flex-col overflow-auto">
      <HeaderEdit isFullscreen={isFullscreen} />
      <div className="flex-1">
        <MainEdit isFullscreen={isFullscreen} />
      </div>
      <FooterEdit />
    </div>
  );
}
