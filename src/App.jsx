import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Card, CardHeader, CardContent } from "./components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./components/ui/tabs";
import { Switch } from "./components/ui/switch";
import { Loader2 } from "lucide-react";
import { Badge } from "./components/ui/badge";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const API_KEY = import.meta.env.VITE_API_KEY || "";
const BASE_URL = import.meta.env.VITE_BASE_URL || "https://api.testmail.app/api"; // Testmail API base URL
const NAMESPACE = import.meta.env.VITE_NAMESPACE || ""; // Your inbox ID

const App = () => {
	const [emails, setEmails] = useState([]);
	const [filteredEmails, setFilteredEmails] = useState([]);
	const [selectedEmail, setSelectedEmail] = useState(null);
	const [filters, setFilters] = useState({
		search: "",
	});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [settings, setSettings] = useState({
		autoRefresh: false,
		refreshDuration: 30,
		namespace: NAMESPACE,
		apiKey: API_KEY,
	});

	const fetchEmails = async () => {
		try {
			setLoading(true);
			setError("");
			const response = await axios.get(`${BASE_URL}/json`, {
				params: {
					namespace: settings.namespace,
					apikey: settings.apiKey,
					limit: 100,
				},
			});
			setEmails(response.data.emails || []);
			setFilteredEmails(response.data.emails || []);
		} catch (err) {
			setError(
				"Failed to fetch emails. Check your API key and inbox ID."
			);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchEmails();
		if (settings.autoRefresh) {
			const interval = setInterval(
				fetchEmails,
				settings.refreshDuration * 1000
			);
			return () => clearInterval(interval);
		}
	}, [
		settings.autoRefresh,
		settings.refreshDuration,
		settings.namespace,
		settings.apiKey,
	]);

	const handleFilterChange = () => {
		let filtered = emails;
		if (filters.search) {
			filtered = filtered.filter(
				(email) =>
					email.subject
						.toLowerCase()
						.includes(filters.search.toLowerCase()) ||
					email.from
						.toLowerCase()
						.includes(filters.search.toLowerCase()) ||
					email.text
						.toLowerCase()
						.includes(filters.search.toLowerCase())
			);
		}
		setFilteredEmails(filtered);
	};

	useEffect(() => {
		handleFilterChange();
	}, [filters]);

	return (
		<div className="size-full p-6">
			<Tabs defaultValue="inbox">
				<TabsList className="mb-6">
					<TabsTrigger value="inbox">Inbox</TabsTrigger>
					<TabsTrigger value="settings">Settings</TabsTrigger>
				</TabsList>

				{/* Inbox */}
				<TabsContent value="inbox">
					<div className="flex flex-col md:flex-row gap-4 mb-6">
						<Input
							placeholder="Search by subject or sender"
							value={filters.search}
							onChange={(e) =>
								setFilters({
									...filters,
									search: e.target.value,
								})
							}
						/>

						<Button onClick={fetchEmails} disabled={loading}>
							{loading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Refreshing
								</>
							) : (
								"Refresh"
							)}
						</Button>
					</div>

					{loading ? (
						<div className="flex justify-center items-center py-8">
							<Loader2 className="h-8 w-8 animate-spin" />
						</div>
					) : error ? (
						<div className="text-red-500 text-center py-4">
							{error}
						</div>
					) : (
						<div className="flex flex-col  space-y-4">
							{filteredEmails.length > 0 ? (
								filteredEmails.map((email) => (
									<Card
										key={email.id}
										className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
											email.read ? "opacity-70" : ""
										}`}
										onClick={() => setSelectedEmail(email)}>
										<CardHeader className="p-4">
											<div className="flex justify-between items-start gap-2">
												<h3 className="text-lg font-semibold line-clamp-1">
													{email.subject}
												</h3>
												<span className="text-xs text-gray-500 whitespace-nowrap">
													{new Date(
														email.timestamp
													).toLocaleString()}
												</span>
											</div>
										</CardHeader>
										<CardContent className="p-4 pt-0">
											<div className="flex flex-col gap-1">
												<p className="text-sm text-gray-600">
													From:{" "}
													<span className="font-medium">
														{email.from}
													</span>
												</p>
												<p className="text-sm text-gray-600">
													<Badge>{email.tag}</Badge>
												</p>
											</div>
										</CardContent>
									</Card>
								))
							) : (
								<div className="col-span-full text-center text-gray-600">
									No emails match your filters.
								</div>
							)}
						</div>
					)}
				</TabsContent>

				{/* Settings */}
				<TabsContent value="settings">
					<Card>
						<CardHeader>
							<h2 className="text-xl font-semibold">
								Application Settings
							</h2>
						</CardHeader>
						<CardContent className="space-y-6">
							{/* API Settings */}
							<div className="space-y-4">
								<h3 className="font-medium">
									API Configuration
								</h3>
								<div className="grid gap-4">
									<div className="space-y-2">
										<Label htmlFor="namespace">
											Namespace (Inbox ID)
										</Label>
										<Input
											id="namespace"
											value={settings.namespace}
											onChange={(e) =>
												setSettings({
													...settings,
													namespace: e.target.value,
												})
											}
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="apiKey">API Key</Label>
										<Input
											id="apiKey"
											type="password"
											value={settings.apiKey}
											onChange={(e) =>
												setSettings({
													...settings,
													apiKey: e.target.value,
												})
											}
										/>
									</div>
								</div>
							</div>

							{/* Auto-refresh Settings */}
							<div className="space-y-4">
								<h3 className="font-medium">
									Auto-refresh Settings
								</h3>
								<div className="space-y-4">
									<div className="flex items-center space-x-2">
										<Switch
											id="auto-refresh"
											checked={settings.autoRefresh}
											onCheckedChange={(checked) =>
												setSettings({
													...settings,
													autoRefresh: checked,
												})
											}
										/>
										<Label htmlFor="auto-refresh">
											Enable Auto-refresh
										</Label>
									</div>
									<div className="space-y-2">
										<Label htmlFor="refresh-duration">
											Refresh Interval (seconds)
										</Label>
										<Input
											id="refresh-duration"
											type="number"
											min="5"
											max="3600"
											value={settings.refreshDuration}
											onChange={(e) =>
												setSettings({
													...settings,
													refreshDuration: Math.max(
														5,
														parseInt(
															e.target.value
														) || 30
													),
												})
											}
										/>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>

			<Dialog
				open={selectedEmail !== null}
				onOpenChange={() => setSelectedEmail(null)}>
				<DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
					{selectedEmail && (
						<>
							<DialogHeader>
								<DialogTitle className="text-xl font-bold">
									{selectedEmail.subject}
								</DialogTitle>
								<div className="flex flex-col gap-1 mt-2">
									<p className="text-sm text-gray-600">
										<strong>From:</strong>{" "}
										{selectedEmail.from}
									</p>
									<p className="text-sm text-gray-600">
										<strong>From:</strong>{" "}
										{selectedEmail.envelope_to}
									</p>
									<p className="text-sm text-gray-600">
										<strong>Date:</strong>{" "}
										{new Date(
											selectedEmail.timestamp
										).toLocaleString()}
									</p>
									<button
										className="flex"
										onClick={() => {
											const downloadJSON = selectedEmail;
											const blob = new Blob(
												[
													JSON.stringify(
														downloadJSON,
														null,
														2
													),
												],
												{ type: "application/json" }
											);
											const url =
												URL.createObjectURL(blob);
											const a =
												document.createElement("a");
											a.href = url;
											a.download = `${selectedEmail.oid}.json`;
											a.click();
											URL.revokeObjectURL(url);
										}}>
										<Badge>Download</Badge>
									</button>
								</div>
							</DialogHeader>
							<div
								dangerouslySetInnerHTML={{
									__html:
										selectedEmail.html ||
										selectedEmail.text,
								}}
								className="prose mt-3 max-w-full"
							/>
						</>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default App;
