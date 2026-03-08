require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const samsungMockData = {
    ticker: '005930.KS',
    oneil_score: 92,
    picked_price: 63500,
    technical_details: {
        ma112: 60500,
        ma224: 58000,
        ma448: 55000,
        current_price: 63500,
        volume: 12500000,
        message: "장기 이평선(224일선, 448일선)을 강하게 돌파하며 완전한 정배열 초입에 진입했습니다. 외국인과 기관의 강력한 양매수가 포착되었습니다."
    },
    ai_report: {
        json_data: {
            verdict: "강력 매수",
            investment_score: {
                total: 92,
                breakdown: [
                    { category: "Fundamental Health", score: 24, max_score: 25, reason: "HBM 메모리 매출 가시화 및 파운드리 수율 안정화로 턴어라운드 본격화." },
                    { category: "Technical Trend", score: 23, max_score: 25, reason: "1년 6개월의 박스권 돌파 후 112일/224일선 지지를 받으며 Stage 3 마크업 단계 진입." },
                    { category: "Valuation", score: 21, max_score: 25, reason: "과거 P/B 하단선 터치 후 반등, 경쟁사 대비 여전히 막대한 밸류에이션 매력 존재." },
                    { category: "Momentum", score: 24, max_score: 25, reason: "북미 핵심 고객사 향 HBM3E 퀄테스트 통과 임박 및 기관/외국인 수급 블랙홀 현상." }
                ]
            },
            bull_case_summary: "AI 반도체 수요 폭발과 함께 HBM 시장 내 점유율 회복이 빠르게 진행되며, 레거시 메모리 단가 상승(ASP) 효과가 맞물려 역대급 어닝 서프라이즈를 달성할 것입니다.",
            bear_case_summary: "파운드리 부문의 적자 지속 및 글로벌 매크로 환경 악화로 IT 세트(스마트폰/PC) 수요 회복이 지연될 경우 단기 박스권 횡보 파동이 연장될 수 있습니다."
        },
        markdown: `<!-- FUNDAMENTAL_REPORT -->
# 삼성전자 (005930): 국가대표 1등의 화려한 귀환

Prologue: AI 사이클의 숨겨진 최대 수혜주

## Chapter 1. 재무 건강 검진 (턴어라운드 및 이익률)
삼성전자 반도체(DS) 부문의 턴어라운드가 단순한 회복을 넘어 폭발적인 이익 팽창 구간으로 진입하고 있습니다. 감산 효과가 본격적으로 숫자에 찍히면서 NAND와 DRAM의 고정거래가격(ASP)이 매월 두 자릿수 상승을 기록 중입니다. 모바일(DX) 부문은 프리미엄 AI 스마트폰 수요에 힘입어 든든한 캐시카우 역할을 지속하며 견고한 재무 장벽을 구축하고 있습니다.

## Chapter 2. 산업 분석: 거시적 패러다임 변화
현재 전 세계 산업의 유일한 성장 메가트렌드는 '인공지능(AI)'입니다. AI 데이터센터 구축을 위해서는 엔비디아의 GPU뿐만 아니라 이에 필수적으로 결합되는 고대역폭메모리(HBM)가 반드시 필요합니다. 삼성전자는 이 거대한 HBM 공급망에서 필수 불가결한 핵심 축으로 부상하고 있으며, 온디바이스 AI 시장 개화와 함께 디바이스 자체의 교체 주기까지 이끌어내고 있습니다.

## Chapter 3. 강력한 경제적 해자
단일 기업으로서 메모리 반도체, 비메모리(AP), 파운드리, 스마트폰, 그리고 가전까지 모두 아우르는 수직 계열화 생태계를 완성한 기업은 지구상에 삼성전자가 유일합니다. 이러한 융복합적 턴키(Turn-key) 능력은 다가오는 AGI(범용인공지능) 시대에 고객사들에게 가장 강력하고 커스터마이즈된 솔루션을 제공하는 해자로 작용합니다.

## Chapter 4. 핵심 촉매제 (왜 지금 당장 사야 하는가?)
북미 최대 GPU 고객사(NVD)를 향한 HBM3E 퀄테스트 통과 임박 소식이 강력한 단가 상승(Re-rating) 촉매제가 될 것입니다. 아울러 반도체 수출 지표가 전년 대비 50% 이상 급증하는 등 매크로 데이터 역시 삼성전자의 강력한 V자 실적 반등을 뒷받침하고 있습니다. 

<!-- TECHNICAL_REPORT -->
## Chapter 8. 기술적 분석: 스마트머니의 흔적 🎯

최근 2년간의 일봉 및 주봉 차트 트렌드를 분석한 결과, 전형적인 **Stage 2 (바닥 다지기 및 매집)** 국면을 완벽히 소화하고 거대한 상승 랠리인 **Stage 3 (마크업)** 진입을 알리는 신호탄이 쏘아졌습니다.

특히, 기관과 외국인이 생명선으로 여기는 **224일선(장기 이동평균선)** 부근에서 악재성 뉴스가 나올 때마다 강력한 프로그램 매수세가 유입되며 물량을 쓸어 담는 '베어 트랩(Bear Trap)' 패턴이 확인되었습니다. 현재 스탠 와인스타인(Stan Weinstein)의 1단계 돌파 매매 기법에 정확히 부합하는 대량 거래량 장대양봉이 발생했으며, 지금이 바로 스마트머니의 평균 단가 부근에서 가장 안전하게 탑승할 수 있는 타이밍입니다.

[Outro] 절대 흔들리지 않는 펀더멘털
시장의 단기적 노이즈에 일희일비할 필요가 없습니다. 삼성전자의 압도적 스케일과 AI 시대의 빅사이클이 맞물리는 지금, 일생일대의 투자 기회가 열리고 있습니다.`
    }
};

async function insertSamsungMock() {
    // 기존 삼성전자 데이터가 있다면 삭제 (중복 방지)
    console.log('Clearing old Samsung records...');
    await supabase.from('oneil_picks').delete().eq('ticker', '005930.KS');

    console.log('Inserting Samsung Electronics mock report...');
    const { data, error } = await supabase.from('oneil_picks').insert([mockData]).select();

    if (error) {
        console.error('Error inserting mock report:', JSON.stringify(error, null, 2));
    } else {
        console.log('Successfully inserted Samsung mock report. ID:', data[0].id);
        console.log('You can view it at: http://localhost:3000/picks/' + data[0].id);
    }
}

// Rename mockData variable referencing
const mockData = samsungMockData;
insertSamsungMock();
