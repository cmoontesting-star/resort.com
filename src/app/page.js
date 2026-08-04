

import Header from './components/header';
import HeroBanner from './components/heroBanner';
import Locationbar from './components/locationbar';
import Footer from './components/footer';
import ResortsGrid from './components/ResortsGrid';
import DBConnection from '@/utils/config/db';
import { auth } from "@/app/auth";
import { redirect } from "next/navigation";
import Banner from '@/utils/models/banner';

export default async function Home() {
  const session = await auth()


  await DBConnection()

  if (session) {
    const userName = session.user.name;
    const role = session.user.role;

    console.log("Username:", userName);
    console.log("Role:", role);
    if (role === "superadmin" || role === "subadmin" || role === "admin") {
      redirect("/admin/dashboard");
    }
  }

  const banners = await Banner.find({ isActive: true }).lean();
  const serializedBanners = banners.map(b => ({
    _id: b._id.toString(),
    image: b.image,
    title: b.title,
    description: b.description,
    buttonText: b.buttonText,
  }));

  return (


    <>
      <Header />
      <HeroBanner banners={serializedBanners} />
      {/* <Locationbar /> */}
      <ResortsGrid />
      <Footer />

    </>
  );
}


