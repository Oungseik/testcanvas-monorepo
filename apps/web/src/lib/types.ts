import type { ClientToServerEvents, ServerToClientEvents } from "@repo/domain";
import type { Socket } from "socket.io-client";

export type AppSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

export type DeviceInfo = {
	udid: string;
	os: "android" | "ios";
	name: string;
	os_version: string;
	provider: string;
	usage: "enabled" | "disabled" | "control" | "automation";
	screen_width: string;
	screen_height: string;
	device_type: "real" | "emulator";
	host: string;
	hardware_model: string;
	last_updated_timestamp: number;
	connected: boolean;
	is_resetting: boolean;
	provider_state: string;
	stream_target_fps: number;
	stream_jpeg_quality: number;
	stream_scaling_factor: number;
	installed_apps: string[];
	uses_custom_wda: boolean;
};

export type Device = {
	info: DeviceInfo;
	is_running_automation: boolean;
	last_automation_action_ts: number;
	in_use: boolean;
	in_use_by: string;
	in_use_ts: number;
	appium_new_command_timeout: number;
	is_available_for_automation: boolean;
	available: boolean;
};
