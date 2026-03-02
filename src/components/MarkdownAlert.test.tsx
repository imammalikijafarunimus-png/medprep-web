/**
 * MarkdownAlert Component Tests
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MarkdownAlert } from './MarkdownAlert';

describe('MarkdownAlert', () => {
  describe('High Yield type', () => {
    it('should render with correct styling', () => {
      render(
        <MarkdownAlert type="high-yield">
          This is high yield content
        </MarkdownAlert>
      );

      // The title for high-yield is "Key Fact" not "High Yield"
      expect(screen.getByText('Key Fact')).toBeInTheDocument();
      expect(screen.getByText('This is high yield content')).toBeInTheDocument();
    });

    it('should have amber/yellow color scheme', () => {
      const { container } = render(
        <MarkdownAlert type="high-yield">
          Content
        </MarkdownAlert>
      );

      const alertDiv = container.firstChild as HTMLElement;
      expect(alertDiv.className).toContain('amber');
    });
  });

  describe('Clinical Pearls type', () => {
    it('should render with correct title', () => {
      render(
        <MarkdownAlert type="clinical-pearls">
          Clinical pearl content
        </MarkdownAlert>
      );

      expect(screen.getByText('Clinical Pearl')).toBeInTheDocument();
    });

    it('should have teal color scheme', () => {
      const { container } = render(
        <MarkdownAlert type="clinical-pearls">
          Content
        </MarkdownAlert>
      );

      const alertDiv = container.firstChild as HTMLElement;
      expect(alertDiv.className).toContain('teal');
    });
  });

  describe('Key Difference type', () => {
    it('should render with correct title', () => {
      render(
        <MarkdownAlert type="key-difference">
          Key difference content
        </MarkdownAlert>
      );

      expect(screen.getByText('Key Difference')).toBeInTheDocument();
    });

    it('should have indigo color scheme', () => {
      const { container } = render(
        <MarkdownAlert type="key-difference">
          Content
        </MarkdownAlert>
      );

      const alertDiv = container.firstChild as HTMLElement;
      expect(alertDiv.className).toContain('indigo');
    });
  });

  describe('Mnemonic type', () => {
    it('should render with correct title', () => {
      render(
        <MarkdownAlert type="mnemonic">
          Mnemonic content
        </MarkdownAlert>
      );

      expect(screen.getByText('Mnemonic')).toBeInTheDocument();
    });

    it('should have pink color scheme (not purple)', () => {
      const { container } = render(
        <MarkdownAlert type="mnemonic">
          Content
        </MarkdownAlert>
      );

      const alertDiv = container.firstChild as HTMLElement;
      // Mnemonic uses pink, not purple
      expect(alertDiv.className).toContain('pink');
    });
  });

  describe('Content rendering', () => {
    it('should render children content', () => {
      render(
        <MarkdownAlert type="high-yield">
          <span>Custom child content</span>
        </MarkdownAlert>
      );

      expect(screen.getByText('Custom child content')).toBeInTheDocument();
    });

    it('should render complex content', () => {
      render(
        <MarkdownAlert type="clinical-pearls">
          <div>
            <p>Paragraph 1</p>
            <p>Paragraph 2</p>
          </div>
        </MarkdownAlert>
      );

      expect(screen.getByText('Paragraph 1')).toBeInTheDocument();
      expect(screen.getByText('Paragraph 2')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper structure', () => {
      const { container } = render(
        <MarkdownAlert type="high-yield">
          Content
        </MarkdownAlert>
      );

      // Should have proper nesting
      expect(container.querySelector('div')).toBeInTheDocument();
    });
  });
});