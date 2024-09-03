import { MdOutlineBedroomChild } from "react-icons/md";
import { TbListDetails } from "react-icons/tb";
import { TbBrandBooking } from "react-icons/tb";
export const links = [
  // {
  //   title: 'Profile',
  //   links: [
  //     {
  //       name: 'room',
  //       icon: <MdOutlineBedroomChild />,
  //     },
  //   ],
  // },

  {
    // title: 'Pages',
    links: [
      {
        role: 'student',
        name: 'room',
        icon: <MdOutlineBedroomChild />,
      },
      {
        role: 'student',
        name: 'details',
        icon: <TbBrandBooking />,
      },
      {
        role: 'admin',
        name: 'students',
        icon: < TbListDetails />,
      },
      {
        role: 'admin',
        name: 'booking',
        icon: <TbBrandBooking />,
      },
      {
        role: 'admin',
        name: 'alloted-students',
        icon: <TbBrandBooking />,
      },
    ],
  }
  // },
  // {
  //   title: 'Apps',
  //   links: [
  //     {
  //       name: 'calendar',
  //       icon: <AiOutlineCalendar />,
  //     },
  //     {
  //       name: 'kanban',
  //       icon: <BsKanban />,
  //     },
  //     {
  //       name: 'editor',
  //       icon: <FiEdit />,
  //     },
  //     {
  //       name: 'color-picker',
  //       icon: <BiColorFill />,
  //     },
  //   ],
  // },
  // {
  //   title: 'Charts',
  //   links: [
  //     {
  //       name: 'line',
  //       icon: <AiOutlineStock />,
  //     },
  //     {
  //       name: 'area',
  //       icon: <AiOutlineAreaChart />,
  //     },

  //     {
  //       name: 'bar',
  //       icon: <AiOutlineBarChart />,
  //     },
  //     {
  //       name: 'pie',
  //       icon: <FiPieChart />,
  //     },
  //     {
  //       name: 'financial',
  //       icon: <RiStockLine />,
  //     },
  //     {
  //       name: 'color-mapping',
  //       icon: <BsBarChart />,
  //     },
  //     {
  //       name: 'pyramid',
  //       icon: <GiLouvrePyramid />,
  //     },
  //     {
  //       name: 'stacked',
  //       icon: <AiOutlineBarChart />,
  //     },
  //   ],
  // },
];

export const themeColors = [
  {
    name: 'blue-theme',
    color: '#1A97F5',
  },
  {
    name: 'green-theme',
    color: '#03C9D7',
  },
  {
    name: 'purple-theme',
    color: '#7352FF',
  },
  {
    name: 'red-theme',
    color: '#FF5C8E',
  },
  {
    name: 'indigo-theme',
    color: '#1E4DB7',
  },
  {
    color: '#FB9678',
    name: 'orange-theme',
  },
];