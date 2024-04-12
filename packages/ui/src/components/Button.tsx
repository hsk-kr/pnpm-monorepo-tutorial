import { ComponentProps } from 'react';

const Button = (props: ComponentProps<'button'>) => {
  return <button {...props} />;
};

export default Button;
