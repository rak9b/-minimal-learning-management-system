export type ICourse = {
  _id: string;
  title: string;
  description: string;
  price: number;
  file: {
    url: string;
    key: string;
  };
};
