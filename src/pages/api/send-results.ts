export const prerender = false;

import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { questions, sections, phases, type Question } from '../../data/questions';

const resend = new Resend(import.meta.env.RESEND_API_KEY);
const RECIPIENT_EMAIL = import.meta.env.RECIPIENT_EMAIL;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { answers, startTime } = body as {
      answers: Record<number, 'A' | 'B' | 'C' | 'D'>;
      startTime: number;
    };

    if (!answers || !startTime) {
      return new Response(JSON.stringify({ error: 'Missing answers or startTime' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Compute scores server-side
    const sectionScores: Record<string, { correct: number; total: number }> = {};
    let totalCorrect = 0;

    sections.forEach(section => {
      sectionScores[section.id] = { correct: 0, total: 0 };
    });

    questions.forEach(q => {
      sectionScores[q.section].total++;
      if (answers[q.id] === q.correctAnswer) {
        sectionScores[q.section].correct++;
        totalCorrect++;
      }
    });

    const total = questions.length;
    const percentage = Math.round((totalCorrect / total) * 100);

    // Compute IC level
    let icLevel: string;
    let icTitle: string;
    if (percentage >= 85) {
      icLevel = 'IC4';
      icTitle = 'Staff Engineer';
    } else if (percentage >= 65) {
      icLevel = 'IC3';
      icTitle = 'Senior Engineer';
    } else if (percentage >= 35) {
      icLevel = 'IC2';
      icTitle = 'Mid-Level Engineer';
    } else {
      icLevel = 'IC1';
      icTitle = 'Junior Engineer';
    }

    // Compute time spent
    const elapsedMs = Date.now() - startTime;
    const elapsedSec = Math.floor(elapsedMs / 1000);
    const minutes = Math.floor(elapsedSec / 60);
    const seconds = elapsedSec % 60;
    const timeSpent = `${minutes}:${seconds.toString().padStart(2, '0')}`;

    const submissionDate = new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Bangkok',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    // Build score breakdown HTML
    let breakdownHtml = '';
    for (const phase of phases) {
      const phaseSections = sections.filter(s => s.phase === phase.id);
      const phaseCorrect = phaseSections.reduce((sum, s) => sum + sectionScores[s.id].correct, 0);
      const phaseTotal = phaseSections.reduce((sum, s) => sum + sectionScores[s.id].total, 0);
      const phasePercent = Math.round((phaseCorrect / phaseTotal) * 100);

      breakdownHtml += `
        <tr style="background-color:#1a1a2e;">
          <td colspan="3" style="padding:10px 14px;font-weight:bold;color:#f59e0b;border-bottom:1px solid #333;">
            Phase ${phase.id}: ${phase.name} &mdash; ${phaseCorrect}/${phaseTotal} (${phasePercent}%)
          </td>
        </tr>`;

      for (const section of phaseSections) {
        const score = sectionScores[section.id];
        const sectionPercent = Math.round((score.correct / score.total) * 100);
        const color = sectionPercent >= 80 ? '#22c55e' : sectionPercent >= 60 ? '#f59e0b' : '#ef4444';
        breakdownHtml += `
        <tr>
          <td style="padding:8px 14px 8px 28px;color:#ccc;border-bottom:1px solid #222;">Section ${section.id}: ${section.name}</td>
          <td style="padding:8px 14px;text-align:center;color:${color};font-weight:600;border-bottom:1px solid #222;">${score.correct}/${score.total}</td>
          <td style="padding:8px 14px;text-align:center;color:${color};font-weight:600;border-bottom:1px solid #222;">${sectionPercent}%</td>
        </tr>`;
      }
    }

    // Build per-question review HTML
    let reviewHtml = '';
    questions.forEach((q, i) => {
      const userAnswer = answers[q.id];
      const correct = userAnswer === q.correctAnswer;
      const icon = correct ? '&#9989;' : '&#10060;';
      const bgColor = correct ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)';
      const borderColor = correct ? '#22c55e' : '#ef4444';

      reviewHtml += `
      <div style="padding:10px 14px;margin-bottom:4px;background:${bgColor};border-left:3px solid ${borderColor};border-radius:4px;">
        <span style="color:#ccc;">${icon} <strong>Q${q.id}</strong>: ${escapeHtml(q.question.substring(0, 80))}${q.question.length > 80 ? '...' : ''}</span><br/>
        <span style="font-size:12px;color:#999;">Your answer: <strong>${userAnswer || 'None'}</strong> | Correct: <strong>${q.correctAnswer}</strong></span>
      </div>`;
    });

    const scoreColor = percentage >= 80 ? '#22c55e' : percentage >= 60 ? '#f59e0b' : '#ef4444';
    const icColor = icLevel === 'IC4' ? '#22c55e' : icLevel === 'IC3' ? '#06b6d4' : icLevel === 'IC2' ? '#f59e0b' : '#ef4444';

    const html = `
    <div style="max-width:640px;margin:0 auto;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#0f0f1a;color:#e2e8f0;padding:32px 24px;border-radius:12px;">
      <h1 style="text-align:center;color:#f59e0b;margin-bottom:4px;">Technical Assessment Results</h1>
      <p style="text-align:center;color:#94a3b8;margin-top:0;">IC4 Software Engineer - Back End</p>

      <div style="text-align:center;margin:24px 0;">
        <div style="display:inline-block;padding:16px 32px;background:#1a1a2e;border-radius:12px;border:2px solid ${scoreColor};">
          <div style="font-size:48px;font-weight:bold;color:${scoreColor};">${percentage}%</div>
          <div style="color:#94a3b8;font-size:14px;">${totalCorrect} / ${total} correct</div>
        </div>
      </div>

      <table style="width:100%;margin:16px 0;" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding:8px 14px;color:#94a3b8;font-size:13px;">Submitted</td>
          <td style="padding:8px 14px;color:#e2e8f0;font-weight:500;">${submissionDate}</td>
        </tr>
        <tr>
          <td style="padding:8px 14px;color:#94a3b8;font-size:13px;">Time Spent</td>
          <td style="padding:8px 14px;color:#e2e8f0;font-weight:500;">${timeSpent}</td>
        </tr>
        <tr>
          <td style="padding:8px 14px;color:#94a3b8;font-size:13px;">IC Level</td>
          <td style="padding:8px 14px;color:${icColor};font-weight:700;font-size:18px;">${icLevel} &mdash; ${icTitle}</td>
        </tr>
      </table>

      <h2 style="color:#f59e0b;font-size:18px;margin-top:32px;border-bottom:1px solid #333;padding-bottom:8px;">Score Breakdown</h2>
      <table style="width:100%;border-collapse:collapse;" cellpadding="0" cellspacing="0">
        ${breakdownHtml}
      </table>

      <h2 style="color:#f59e0b;font-size:18px;margin-top:32px;border-bottom:1px solid #333;padding-bottom:8px;">Answer Review</h2>
      ${reviewHtml}

      <p style="text-align:center;color:#64748b;font-size:12px;margin-top:32px;">Sent automatically by the Technical Assessment platform.</p>
    </div>`;

    const { error } = await resend.emails.send({
      from: 'Technical Assessment <onboarding@resend.dev>',
      to: RECIPIENT_EMAIL,
      subject: `Assessment Results: ${percentage}% (${icLevel} - ${icTitle})`,
      html,
    });

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Unknown error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
