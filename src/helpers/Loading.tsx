import ReactLoading from "react-loading";
import PropTypes from "prop-types";

export default function Loading(props: any) {
  return (
    <div
      className={
        `fixed left-0 top-0 z-50 flex h-screen w-screen items-center justify-center ` +
        (props.hideBg ? "bg-[#c3c3c3]" : "bg-[rgba(60,60,60,0.5)]")
      }
    >
      <ReactLoading type="bars" color="white" height={100} width={100} />
    </div>
  );
}

Loading.propTypes = {
  hideBg: PropTypes.bool,
};

Loading.defaultProps = {
  hideBg: false,
};
