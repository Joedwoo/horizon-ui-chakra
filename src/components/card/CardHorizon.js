import { Box, useStyleConfig } from "@chakra-ui/react";

function CardHorizon(props) {
  const { variant, children, extra, ...rest } = props;
  const styles = useStyleConfig("Card", { variant });

  return (
    <Box __css={styles} className={extra} {...rest}>
      {children}
    </Box>
  );
}

export default CardHorizon;