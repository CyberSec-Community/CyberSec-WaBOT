import { Event } from "../types/Event";
import { Client } from "../client/Client";
import { ParticipantAction } from "@whiskeysockets/baileys";

type TGreetings = {
  id: string;
  participants: string[];
  action: ParticipantAction;
};

export = class extends Event {
  constructor(client: Client) {
    super(client, {
      name: "group-participants.update",
    });
  }

  run = async ({ id, participants, action }: TGreetings) => {
    participants.map((user) => {
      if (["add", "remove"].includes(action)) {
        // Log de entrada/saída
        this.client.sock.sendMessage(id, {
          text:
            action == "add"
              ? [
                  "*LOG - Entradas*\n",
                  `Bem vindo(a) @${user.split("@")[0]}!\n`,
                  `Use $regras para poder consultar as regras.`,
                ].join("\n")
              : [
                  "*LOG - Saídas*\n",
                  `Até mais, ${user.split("@")[0]}! 👋`,
                ].join("\n"),
          mentions: action == "add" ? [user] : [],
        });
      } else if (["promote", "demote"].includes(action)) {
        this.client.sock.sendMessage("120363143649754413@g.us", {
          text: [
            "*LOG - Promoção de hierarquia*\n",
            action == "promote"
              ? `@${user.split("@")[0]} agora é um administrador do grupo!`
              : `@${user.split("@")[0]} não é mais um administrador do grupo!`,
          ].join("\n"),
          mentions: [user],
        });
      }
    });
  };
};
