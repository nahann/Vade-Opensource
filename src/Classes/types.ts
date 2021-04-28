import { Client, MessageEmbed } from "discord.js";

export enum OptionType {
    SUB_COMMAND = 1,
    SUB_COMMAND_GROUP = 2,
    STRING = 3,
    INTEGER = 4,
    BOOLEAN = 5,
    USER = 6,
    CHANNEL = 7,
    ROLE = 8,
}

export interface Option {
    name: string;
    description: string;
    type: OptionType;
    required: boolean;
}

export interface Choice {
    name: string;
    value: string;
}

export interface SlashCommandData {
    name: string;
    description: string;
    options?: (Option & { type: OptionType.SUB_COMMAND_GROUP; options: Option[] } & { type: OptionType.STRING | OptionType.INTEGER; choices?: Choice[] })[];
}

export interface SlashCommand extends SlashCommandData {
    execute: (client: Client, interaction: Interaction, methods: Methods) => Promise<unknown> | unknown;
}

export interface Methods {
    respond<T extends { content?: string; embeds?: MessageEmbed[] }>(
        content: T,
        options?: {
            tts?: boolean;
            allowed_mentions?: {
                parse?: ("roles" | "users" | "everyone")[];
                roles?: string[];
                users?: string[];
                replied_user?: boolean;
            };
            flags?: number;
        }
    ): Promise<T>;
}

export interface SlashCommandResponse {
    id: string;
    application_id: string;
    name: string;
    description: string;
    version: string;
    default_permission: boolean;
}

export interface UserObject {
    userame: string;
    bot?: boolean;
    system?: boolean;
    mfa_enabled?: boolean;
    locale?: string;
    verified?: string;
    email?: string;
    flags?: number;
    public_flags?: number;
    premium_type?: number;
    id: string;
    discriminator: string;
    avatar: string;
}

export interface MemberObject {
    user?: UserObject;
    roles: string[];
    premium_since: string;
    permissions?: string;
    pending?: boolean;
    nick?: string;
    mute: boolean;
    joined_at: string;
    is_pending: boolean;
    deaf: boolean;
}

export interface InteractionOption {
    name: string;
    type: OptionType;
    value?: string;
    options?: InteractionOption[];
}

export interface Interaction {
    version: number;
    type: number;
    token: string;
    user?: UserObject;
    member?: MemberObject;
    id: string;
    data?: {
        id: string;
        name: string;
        resolved?: {
            users?: any;
            members?: any;
            roles?: any;
            channels?: any;
        };
        options?: InteractionOption[];
    };
    guild_id?: string;
    channel_id?: string;
    application_id: string;
}
