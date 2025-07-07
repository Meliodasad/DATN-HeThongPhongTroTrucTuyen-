import PostCard from './PostCard';

const dummy = [
  {
    title: 'Phòng trọ gần ĐH Bách Khoa, đầy đủ nội thất',
    price: '2.5 triệu/tháng',
    area: '25 m²',
    address: 'Quận 10, TP. HCM',
    image: 'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2025/07/02/z6510447981340-282eb6c8ce2bab0ae7662307fa101007_1751426209.jpg',
  },
  {
    title: 'Cho thuê căn hộ mini, có ban công, thoáng mát',
    price: '3.2 triệu/tháng',
    area: '30 m²',
    address: 'Quận Gò Vấp, TP. HCM',
    image: 'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2025/07/04/img-20250629-171407_1751603577.jpg',
  },
  {
    title: 'Phòng trọ mới xây, sạch sẽ, an ninh tốt',
    price: '2 triệu/tháng',
    area: '20 m²',
    address: 'Thủ Đức, TP. HCM',
    image: 'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2021/10/27/17f127e466893fd370b536e3d9cd0b15-2742471474502885792_1635303858.jpg',
  },
  {
    title: 'Phòng trọ mới xây, sạch sẽ, an ninh tốt',
    price: '2 triệu/tháng',
    area: '20 m²',
    address: 'Thủ Đức, TP. HCM',
    image: 'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2021/10/27/17f127e466893fd370b536e3d9cd0b15-2742471474502885792_1635303858.jpg',
  },
  {
    title: 'Phòng trọ mới xây, sạch sẽ, an ninh tốt',
    price: '2 triệu/tháng',
    area: '20 m²',
    address: 'Thủ Đức, TP. HCM',
    image: 'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2021/10/27/17f127e466893fd370b536e3d9cd0b15-2742471474502885792_1635303858.jpg',
  },
  {
    title: 'Phòng trọ mới xây, sạch sẽ, an ninh tốt',
    price: '2 triệu/tháng',
    area: '20 m²',
    address: 'Thủ Đức, TP. HCM',
    image: 'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2021/10/27/17f127e466893fd370b536e3d9cd0b15-2742471474502885792_1635303858.jpg',
  },
  
];

const PostList = () => {
  return (
    <div className="flex flex-col gap-4">
      {dummy.map((post, index) => (
        <PostCard key={index} {...post} />
      ))}
    </div>
  );
};

export default PostList;
