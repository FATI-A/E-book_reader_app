import { useLocation } from "react-router-dom";

export default function BookContentPage() {
  const location = useLocation();
  const { textUrl } = location.state as { textUrl: string };

  return (
    <div>
      <h1>Contenu du livre</h1>
      <iframe src={textUrl} width="100%" height="600px" title="Livre"></iframe>
    </div>
  );
}