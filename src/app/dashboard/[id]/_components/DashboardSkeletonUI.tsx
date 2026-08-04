import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export function DashboardSkeletonUI() {
  return (
    <SkeletonTheme baseColor="#2a2a2d" highlightColor="#3f3f46">
      <div className="text-gray-100 max-md:px-4 lg:px-12.5">
        {/* 1. 공통 헤더 영역 (아이콘 + 대시보드 제목) */}
        <div className="flex items-center gap-1 pt-6 pb-3.5 md:mx-10 lg:mx-0">
          <Skeleton width={24} height={24} borderRadius={4} />
          <Skeleton width={180} height={32} borderRadius={8} />
        </div>

        {/* ==========================================
            모바일 및 태블릿 환경 전용 스켈레톤 (lg:hidden)
        ========================================== */}
        <div className="flex w-full items-center justify-between md:mx-10 lg:hidden [&::-webkit-scrollbar]:hidden">
          {/* 탭 리스트 */}
          <div className="flex items-center gap-2 py-6">
            <Skeleton width={80} height={32} borderRadius={9999} />
            <Skeleton width={100} height={32} borderRadius={9999} />
            <Skeleton width={90} height={32} borderRadius={9999} />
          </div>
          {/* 우측 + 버튼 */}
          <div className="m-2">
            <Skeleton width={32} height={32} circle />
          </div>
        </div>

        {/* 모바일/태블릿 단일 컬럼 리스트 */}
        <div className="pt-2.5 lg:hidden">
          <div className="flex w-full justify-center gap-1.5">
            <div className="w-full max-w-sm md:max-w-lg">
              {/* 컬럼 제목 */}
              <div className="mb-4 flex items-center gap-2">
                <Skeleton width={30} height={24} borderRadius={4} />
                <Skeleton width={20} height={20} circle />
              </div>
              {/* 할 일 카드들 */}
              <div className="flex flex-col gap-4">
                <Skeleton height={120} borderRadius={12} />
                <Skeleton height={120} borderRadius={12} />
              </div>
            </div>
          </div>
        </div>

        {/* ==========================================
            데스크탑 전용 스켈레톤 (lg:flex)
        ========================================== */}
        <div className="hidden gap-15 lg:flex">
          {/* 데스크탑은 보통 3개 정도의 컬럼이 가로로 나열되므로 map으로 생성 */}
          {[1, 2, 3].map((col) => (
            // w-[350px] 부분은 실제 네 ColumnList의 너비에 맞게 조절해 줘!
            <div key={col} className="w-87.5 shrink-0 flex-col">
              {/* 컬럼 제목 */}
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Skeleton width={100} height={28} borderRadius={4} />
                  <Skeleton width={24} height={24} circle />
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <Skeleton height={130} borderRadius={12} />
                <Skeleton height={130} borderRadius={12} />
                {col === 1 && <Skeleton height={130} borderRadius={12} />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </SkeletonTheme>
  );
}
