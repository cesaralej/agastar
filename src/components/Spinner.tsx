import { GridLoader } from "react-spinners";

const override = {
  display: "block",
  margin: "100px auto",
};

interface SpinnerProps {
  loading: boolean;
}

const Spinner: React.FC<SpinnerProps> = ({ loading }) => {
  return (
    <GridLoader
      color="#4338ca"
      loading={loading}
      cssOverride={override}
      size={10}
    />
  );
};

export default Spinner;
