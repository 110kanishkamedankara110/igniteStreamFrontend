import MasonryLayout from "@/components/MasonaryLayout";

const Home: React.FC = () => {
  const items = [
    { id:1,video:'http://localhost:8080/api/v1/VideoService/play?v=C:/Users/BLACKBOX/Videos/New%20folder/The%20Carpenters%20-%20Top%20Of%20The%20World%20%E2%80%A2%20TopPop.mp4',image: 'https://i.pinimg.com/736x/61/3e/b1/613eb1864c8d05405718e19b237e7f97.jpg', title: 'Item 1' },
    { id:2,video:'http://localhost:8080/api/v1/VideoService/play?v=C:/Users/BLACKBOX/Videos/New%20folder/Top%20of%20the%20World%20-%20The%20Petersens%20(LIVE).mp4',image: 'https://i.pinimg.com/736x/d5/f2/c6/d5f2c6fac0e0f6496a039370c2be8732.jpg', title: 'Item 2' },
    { id:3,video:'http://localhost:8080/api/v1/VideoService/play?v=C:/Users/BLACKBOX/Videos/New%20folder/The%20Carpenters%20-%20Top%20Of%20The%20World%20%E2%80%A2%20TopPop.mp4',image: 'https://i.pinimg.com/736x/20/b9/3a/20b93adb7581b02759375f4563cb4245.jpg', title: 'Item 3' },
    { id:4,image: 'https://i.pinimg.com/736x/3d/cc/94/3dcc9490f725ea657f64046e3976127d.jpg', title: 'Item 4' },
    { id:5,image: 'https://i.pinimg.com/736x/5b/47/b3/5b47b379b1b68203e775220a697f84af.jpg', title: 'Item 5' },
    { id:6,image:'https://i.pinimg.com/736x/77/92/83/779283c649b3bae6b86da9373dc0130f.jpg',title:"img 5"},
    { id:7,image: 'https://i.pinimg.com/736x/61/3e/b1/613eb1864c8d05405718e19b237e7f97.jpg', title: 'Item 1' },
    { id:8,image: 'https://i.pinimg.com/736x/d5/f2/c6/d5f2c6fac0e0f6496a039370c2be8732.jpg', title: 'Item 2' },
    { id:9,image: 'https://i.pinimg.com/736x/20/b9/3a/20b93adb7581b02759375f4563cb4245.jpg', title: 'Item 3' },
    { id:10,image: 'https://i.pinimg.com/736x/3d/cc/94/3dcc9490f725ea657f64046e3976127d.jpg', title: 'Item 4' },
    { id:11,image: 'https://i.pinimg.com/736x/5b/47/b3/5b47b379b1b68203e775220a697f84af.jpg', title: 'Item 5' },
    { id:12,image:'https://i.pinimg.com/736x/77/92/83/779283c649b3bae6b86da9373dc0130f.jpg',title:"img 5"}
];

  return (
    <div className="p-10">
      <MasonryLayout items={items} />
    </div>
  );
};

export default Home;
