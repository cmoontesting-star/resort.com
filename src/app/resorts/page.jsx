import Header from "../components/header";
import ResortsGrid from "../components/ResortsGrid";
import Footer from "../components/footer";

export default async function ResortsPage() {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50/50">
            <Header />
            <main className="flex-1 py-12">
                <ResortsGrid />
            </main>
            <Footer />
        </div>
    );
}
