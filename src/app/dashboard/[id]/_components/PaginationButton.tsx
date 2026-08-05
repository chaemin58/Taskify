import Leftbtn from "@/assets/mydashboard/ic_left_arrow.svg";
import Rightbtn from "@/assets/mydashboard/ic_right_arrow.svg";

interface PaginationButtonProp {
  current: number;
  total: number;
  onClickPrev: () => void;
  onClickNext: () => void;
}

export function PaginationButton({
  current,
  total,
  onClickPrev: handleClickPrev,
  onClickNext: handleClickNext,
}: PaginationButtonProp) {
  return (
    <div className="ml-auto flex gap-5 pt-5">
      <div>
        {current + 1} of {total}
      </div>
      <button
        className="disabled:opacity-30"
        onClick={handleClickPrev}
        disabled={current === 0}
      >
        <Leftbtn />
      </button>
      <button
        className="disabled:opacity-30"
        onClick={handleClickNext}
        disabled={current === total - 1}
      >
        <Rightbtn />
      </button>
    </div>
  );
}
