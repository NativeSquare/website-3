"use client";

import { useState } from "react";

export default function Entrer() {
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState("");
  const [envoi, setEnvoi] = useState(false);

  async function entrer(e: React.FormEvent) {
    e.preventDefault();
    setEnvoi(true);
    setErreur("");
    const reponse = await fetch("/api/interne/entrer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ motDePasse }),
    });
    setEnvoi(false);
    if (reponse.ok) {
      location.reload();
      return;
    }
    setErreur("Mot de passe invalide.");
  }

  return (
    <div className="bk-entrer">
      <form onSubmit={entrer}>
        <h1>Booker</h1>
        <p>Outil interne. Entre le mot de passe pour continuer.</p>
        <input
          type="password"
          value={motDePasse}
          onChange={(e) => setMotDePasse(e.target.value)}
          placeholder="Mot de passe"
          autoFocus
        />
        <button className="btn btn-primary" disabled={envoi || !motDePasse}>
          {envoi ? "…" : "Entrer"}
        </button>
        {erreur && <p className="bk-erreur">{erreur}</p>}
      </form>
    </div>
  );
}
