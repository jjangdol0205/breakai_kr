export default function PrivacyPolicy() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-20 text-slate-300 font-sans leading-relaxed">
            <h1 className="text-4xl font-bold text-white mb-8 border-b border-[#333] pb-4">개인정보처리방침</h1>
            <p className="text-sm text-zinc-500 mb-8 font-mono">마지막 업데이트: 2026년 2월</p>

            <div className="space-y-8">
                <section>
                    <h2 className="text-2xl font-semibold text-red-400 mb-4">1. 개요</h2>
                    <p>Breakout AI에 오신 것을 환영합니다. 당사는 귀하의 개인정보를 보호하기 위해 최선을 다하고 있습니다. 본 개인정보처리방침은 귀하가 당사 웹사이트를 방문할 때 개인정보가 어떻게 관리되는지, 그리고 귀하의 권리와 법적 보호에 대해 안내합니다.</p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-red-400 mb-4">2. 수집하는 개인정보 항목</h2>
                    <p>당사는 다음과 같이 분류된 다양한 종류의 개인 데이터를 수집, 사용, 저장 및 전송할 수 있습니다.</p>
                    <ul className="list-disc pl-6 mt-4 space-y-2 text-zinc-400">
                        <li><strong>식별 데이터</strong>: 이름, 성별, 사용자 이름 또는 유사한 식별자 포함.</li>
                        <li><strong>연락처 데이터</strong>: 이메일 주소 및 전화번호 포함.</li>
                        <li><strong>기술 데이터</strong>: 접속 IP 주소, 로그인 데이터, 브라우저 유형 및 버전, 시간대 설정 및 위치, 운영 체제 및 플랫폼 등 접속에 사용되는 기기의 기술 정보.</li>
                        <li><strong>사용 데이터</strong>: 귀하가 당사 웹사이트 및 서비스를 이용하는 방식에 대한 정보.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-red-400 mb-4">3. 개인정보 이용 목적</h2>
                    <p>당사는 법적으로 허용된 경우에만 개인정보를 사용합니다. 주요 사용 목적은 다음과 같습니다:</p>
                    <ul className="list-disc pl-6 mt-4 space-y-2 text-zinc-400">
                        <li>사용자와 계약을 체결하거나 이행해야 하는 경우.</li>
                        <li>당사(또는 제3자)의 정당한 이익을 위해 필요하며 귀하의 기본권이 이를 우선하지 않는 경우.</li>
                        <li>법적 의무를 준수해야 하는 경우.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-red-400 mb-4">4. 쿠키 및 추적 기술</h2>
                    <p>당사 및 제3자 서비스 제공업체(Google AdSense 및 Google Analytics 등)는 쿠키 및 유사한 추적 기술을 사용하여 서비스 활동을 추적하고 특정 정보를 저장합니다. 사용되는 기술에는 비콘, 태그 및 스크립트가 포함되며, 이를 통해 서비스 질을 분석하고 향상시킵니다.</p>
                    <p className="mt-4">Google을 포함한 제3자 공급업체는 쿠키를 사용하여 사용자의 이전 방문 기록을 기반으로 광고를 게재합니다. Google의 파트너는 인터넷 상의 다른 사이트 방문 기록을 기반으로 타겟팅된 광고를 제공할 수 있습니다.</p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-red-400 mb-4">5. 문의하기</h2>
                    <p>본 개인정보처리방침에 대해 궁금한 점이 있으시면 다음 이메일로 문의해 주십시오: <strong>contact@breakout.ai</strong></p>
                </section>
            </div>
        </div>
    );
}
