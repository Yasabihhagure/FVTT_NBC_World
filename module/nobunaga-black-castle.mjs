import { NobunagaActorSheet } from "./sheets/actor-sheet.mjs";
import { preloadHandlebarsTemplates } from "./helpers/templates.mjs";
import { NBCASTLE } from "./config.mjs";

console.log("Nobunaga's Black Castle | Initializing system");

Hooks.once('init', async function () {
  console.log("Nobunaga's Black Castle | Initializing system hooks");

  // Assign custom classes and constants here
  CONFIG.NBCASTLE = NBCASTLE;

  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("nobunaga-black-castle", NobunagaActorSheet, { makeDefault: true });

  // Preload Handlebars templates
  return preloadHandlebarsTemplates();
});
