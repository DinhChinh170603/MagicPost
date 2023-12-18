import ReactLoading from "react-loading";
import PropTypes from "prop-types";

export default function Loading(props: any) {
  return (
    <div
      className={
        `${props.relative ? "absolute" : "fixed"} left-0 top-0 z-[1000] flex h-full w-full items-center justify-center ` +
        (props.hideBg ? "bg-[#c3c3c3]" : "bg-[rgba(101,101,101,0.3)]")
      }
    >
      <ReactLoading type="bars" color="white" height={100} width={100} />
    </div>
  );
}

Loading.propTypes = {
  hideBg: PropTypes.bool,
  relative: PropTypes.bool,
};

Loading.defaultProps = {
  hideBg: false,
  relative: false,
};
