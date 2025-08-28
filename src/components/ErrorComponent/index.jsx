import Icons from "components/Icons";
import { getStyles } from "views/MainPage/styles";

export default function ErrorComponent() {
  return (
    <div className="app">
      <div className="background-gradient"></div>
      <div className="error-container">
        <Icons.AlertTriangle />
        <h1>데이터 로드 실패</h1>
        <p>dRPC 프리미엄 서비스와의 연결을 확인하고 새로고침 해주세요.</p>
        <button
          onClick={() => window.location.reload()}
          className="action-button primary"
        >
          새로고침
        </button>
      </div>
      <style dangerouslySetInnerHTML={{ __html: getStyles() }}></style>
    </div>
  );
}
