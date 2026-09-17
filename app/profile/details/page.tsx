"use client";

import Link from "next/link";
import { useState } from "react";

export default function ProfileDetailsPage() {
  const [saved, setSaved] = useState(false);

  return (
    <main className="profile-page profile-details-page">
      <div className="profile-details-heading"><Link href="/profile" aria-label="Back to profile">&#8592;</Link><h1>Edit Profile</h1></div>
      <div className="profile-details-avatar">MB</div>
      <p className="profile-details-intro">Keep your account details up to date.</p>
      <form className="profile-details-form" onSubmit={(event) => { event.preventDefault(); setSaved(true); }}>
        <label>Full name<input defaultValue="Muntazir Bukhari" /></label>
        <label>Email address<input type="email" defaultValue="hello@muntazirandsons.com" /></label>
        <label>Phone number<input type="tel" defaultValue="+92 300 1234567" /></label>
        <button type="submit">{saved ? "Changes saved" : "Save changes"}</button>
      </form>
      {saved && <p className="profile-details-status" role="status">Your profile has been updated.</p>}
    </main>
  );
}