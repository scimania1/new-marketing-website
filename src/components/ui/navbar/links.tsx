import { Home, Box, Phone, Building2, LucideProps } from "lucide-react";

// export const Icons = {
//   home: (props: LucideProps) => <Home {...props} />,
//   about: (props: LucideProps) => <Building2 {...props} />,
//   products: (props: LucideProps) => <Box {...props} />,
//   contactUs: (props: LucideProps) => <Phone {...props} />,
// };

interface IconProps extends LucideProps {
  url: string;
}

export function Icon(props: IconProps) {
  const { url } = props;
  if (url === "/about") {
    return <Building2 {...props} />;
  } else if (url === "/products") {
    return <Box {...props} />;
  } else if (url === "/contact-us") {
    return <Phone {...props} />;
  }
  return <Home {...props} />;
}

type NavigationLink = {
  name: string;
  url: string;
};

const navigationLinks: NavigationLink[] = [
  {
    name: "Home",
    url: "/",
  },
  {
    name: "About",
    url: "/about",
  },
  {
    name: "Products",
    url: "/products",
  },
  {
    name: "Contact Us",
    url: "/contact-us",
  },
];

export default navigationLinks;
