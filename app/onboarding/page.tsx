import { submitOnboarding } from "./action";

export default function OnboardingPage() {
    return (
        <main className="min-h-screen pt-[180px] pb-[100px] px-5 bg-white">
            <div className="max-w-[700px] mx-auto bg-white p-10 rounded-2xl shadow-xl">
                <h1 className="text-3xl font-extrabold text-center mb-8">Welcome! アンケートにご協力ください</h1>
                <p className="text-center text-gray-600 mb-10">
                    あなたに最適なキャリアパスと教材を提案するために、現在の状況を教えてください。
                </p>

                <form action={submitOnboarding} className="space-y-8">
                    <div>
                        <label className="block font-bold text-lg mb-3">現在の所属大学・学科 <span className="text-red-500">*</span></label>
                        <input
                            name="university"
                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent outline-none"
                            placeholder="例: 東京大学 工学部 システム創成学科"
                            required
                        />
                    </div>

                    <div>
                        <label className="block font-bold text-lg mb-3">学年 <span className="text-red-500">*</span></label>
                        <select name="grade" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent outline-none" required>
                            <option value="">選択してください</option>
                            <option value="B1">学部1年</option>
                            <option value="B2">学部2年</option>
                            <option value="B3">学部3年</option>
                            <option value="B4">学部4年</option>
                            <option value="M1">修士1年</option>
                            <option value="M2">修士2年</option>
                            <option value="D">博士</option>
                            <option value="Other">その他</option>
                        </select>
                    </div>

                    <div>
                        <label className="block font-bold text-lg mb-3">志望大学院・専攻（任意）</label>
                        <input
                            name="targetUniversity"
                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent outline-none"
                            placeholder="例: 東京大学 大学院 新領域創成科学研究科"
                        />
                    </div>

                    <div>
                        <label className="block font-bold text-lg mb-3">興味のある分野（複数選択可）</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 font-semibold">
                            <label className="flex items-center gap-2 cursor-pointer p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                                <input type="checkbox" name="interests" value="AI" className="w-5 h-5 accent-accent" /> AI・情報学
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                                <input type="checkbox" name="interests" value="Mechanical" className="w-5 h-5 accent-accent" /> 機械・ロボ工学
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                                <input type="checkbox" name="interests" value="Bio" className="w-5 h-5 accent-accent" /> バイオ・生命科学
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                                <input type="checkbox" name="interests" value="Physics" className="w-5 h-5 accent-accent" /> 物理・材料系
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                                <input type="checkbox" name="interests" value="Biz" className="w-5 h-5 accent-accent" /> 経営・MOT
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                                <input type="checkbox" name="interests" value="Career" className="w-5 h-5 accent-accent" /> 外部受験・理転
                            </label>
                        </div>
                    </div>

                    <div>
                        <label className="block font-bold text-lg mb-3">将来のキャリアパス <span className="text-red-500">*</span></label>
                        <select name="careerPath" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent outline-none" required>
                            <option value="">選択してください</option>
                            <option value="Corporate">修士卒で企業就職</option>
                            <option value="Academia">博士進学 (アカデミア志望)</option>
                            <option value="R&D">博士進学 (企業R&D志望)</option>
                            <option value="Startup">起業・スタートアップ</option>
                            <option value="Undecided">未定</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="w-full p-5 bg-text text-white text-xl font-bold rounded-full transition-all hover:bg-accent hover:scale-[1.01] shadow-lg"
                    >
                        回答してマイページへ
                    </button>
                </form>
            </div>
        </main>
    );
}
